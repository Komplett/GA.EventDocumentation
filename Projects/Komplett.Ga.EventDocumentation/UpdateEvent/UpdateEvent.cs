using Komplett.Ga.EventDocumentation.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Komplett.Ga.EventDocumentation.UpdateEvent;

public class UpdateEvent
{
    private readonly IBigQueryRepository _repository;
    private readonly ILogger<UpdateEvent> _logger;

    public UpdateEvent(IBigQueryRepository repository, ILogger<UpdateEvent> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [Function("UpdateEvent")]
    public async Task<IActionResult> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
        HttpRequest req)
    {
        try
        {
            Event updatedEvent;
            
            try
            {
                updatedEvent = await req.ReadFromJsonAsync<Event>();
            }
            catch (System.Text.Json.JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON in request body");
                return new BadRequestObjectResult("Invalid JSON format in request body");
            }

            if (updatedEvent == null)
            {
                _logger.LogWarning("Invalid request body received");
                return new BadRequestObjectResult("Please pass a valid event in the request body");
            }
            
            if (string.IsNullOrEmpty(updatedEvent.EventName))
            {
                _logger.LogWarning("Request missing required EventName property");
                return new BadRequestObjectResult("EventName is required");
            }
            
            await _repository.UpdateEventAsync(updatedEvent);
            
            return new OkResult();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument: {Message}", ex.Message);
            return new BadRequestObjectResult(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating event");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
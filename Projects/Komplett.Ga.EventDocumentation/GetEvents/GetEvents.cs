using Komplett.Ga.EventDocumentation.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Komplett.Ga.EventDocumentation.GetEvents;

public class GetEvents
{
    private readonly IBigQueryRepository _repository;
    private readonly ILogger<GetEvents> _logger;

    public GetEvents(IBigQueryRepository repository, ILogger<GetEvents> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [Function("GetEvents")]
    public async Task<IActionResult> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)]
        HttpRequest req)
    {
        try
        {
            var events = await _repository.GetEventsAsync();
            return new OkObjectResult(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving events");
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
using Komplett.Ga.EventDocumentation.Shared;
using Komplett.Ga.EventDocumentation.UpdateEvent;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text;
using System.Text.Json;
using Xunit;

namespace Komplett.Ga.EventDocumentation.Tests;

public class UpdateEventTests
{
    private readonly Mock<IBigQueryRepository> _mockRepository;
    private readonly Mock<ILogger<Komplett.Ga.EventDocumentation.UpdateEvent.UpdateEvent>> _mockLogger;
    private readonly Komplett.Ga.EventDocumentation.UpdateEvent.UpdateEvent _updateEvent;

    public UpdateEventTests()
    {
        _mockRepository = new Mock<IBigQueryRepository>();
        _mockLogger = new Mock<ILogger<Komplett.Ga.EventDocumentation.UpdateEvent.UpdateEvent>>();
        _updateEvent = new Komplett.Ga.EventDocumentation.UpdateEvent.UpdateEvent(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task RunAsync_ReturnsOkResult_WhenUpdateSucceeds()
    {
        // Arrange
        var testEvent = new Event
        {
            EventName = "test_event",
            Description = "Updated description",
            Format = "{}",
            Type = "client",
            Tags = "[\"tag1\",\"tag2\"]"
        };

        var request = CreateHttpRequestWithJsonBody(testEvent);

        _mockRepository.Setup(repo => repo.UpdateEventAsync(It.IsAny<Event>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _updateEvent.RunAsync(request);

        // Assert
        Assert.IsType<OkResult>(result);
        _mockRepository.Verify(repo => repo.UpdateEventAsync(It.Is<Event>(e => 
            e.EventName == testEvent.EventName && 
            e.Description == testEvent.Description)), 
            Times.Once);
    }

    [Fact]
    public async Task RunAsync_ReturnsBadRequest_WhenBodyIsInvalid()
    {
        // Arrange
        var httpContext = new DefaultHttpContext();
        var request = httpContext.Request;
        
        // Set content type to application/json to trigger JSON deserialization
        request.Headers["Content-Type"] = "application/json";
        request.Body = new MemoryStream(Encoding.UTF8.GetBytes("invalid json"));

        // Act
        var result = await _updateEvent.RunAsync(request);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RunAsync_ReturnsBadRequest_WhenEventNameIsMissing()
    {
        // Arrange
        var testEvent = new Event
        {
            EventName = "",
            Description = "Test description"
        };

        var request = CreateHttpRequestWithJsonBody(testEvent);

        // Act
        var result = await _updateEvent.RunAsync(request);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("EventName is required", badRequestResult.Value);
    }

    [Fact]
    public async Task RunAsync_ReturnsBadRequest_WhenArgumentExceptionIsThrown()
    {
        // Arrange
        var testEvent = new Event
        {
            EventName = "test_event",
            Description = "Test description"
        };

        var request = CreateHttpRequestWithJsonBody(testEvent);

        _mockRepository.Setup(repo => repo.UpdateEventAsync(It.IsAny<Event>()))
            .ThrowsAsync(new ArgumentException("Test argument exception"));

        // Act
        var result = await _updateEvent.RunAsync(request);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Test argument exception", badRequestResult.Value);
    }

    [Fact]
    public async Task RunAsync_ReturnsInternalServerError_WhenExceptionOccurs()
    {
        // Arrange
        var testEvent = new Event
        {
            EventName = "test_event",
            Description = "Test description"
        };

        var request = CreateHttpRequestWithJsonBody(testEvent);

        _mockRepository.Setup(repo => repo.UpdateEventAsync(It.IsAny<Event>()))
            .ThrowsAsync(new Exception("Test exception"));

        // Act
        var result = await _updateEvent.RunAsync(request);

        // Assert
        var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
    }

    private static HttpRequest CreateHttpRequestWithJsonBody(Event testEvent)
    {
        var json = JsonSerializer.Serialize(testEvent);
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(json));
        httpContext.Request.Headers.Add("Content-Type", "application/json");
        return httpContext.Request;
    }
}

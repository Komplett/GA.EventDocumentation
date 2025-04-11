using Komplett.Ga.EventDocumentation.GetEvents;
using Komplett.Ga.EventDocumentation.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Komplett.Ga.EventDocumentation.Tests;

public class GetEventsTests
{
    private readonly Mock<IBigQueryRepository> _mockRepository;
    private readonly Mock<ILogger<Komplett.Ga.EventDocumentation.GetEvents.GetEvents>> _mockLogger;
    private readonly Komplett.Ga.EventDocumentation.GetEvents.GetEvents _getEvents;

    public GetEventsTests()
    {
        _mockRepository = new Mock<IBigQueryRepository>();
        _mockLogger = new Mock<ILogger<Komplett.Ga.EventDocumentation.GetEvents.GetEvents>>();
        _getEvents = new Komplett.Ga.EventDocumentation.GetEvents.GetEvents(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task RunAsync_ReturnsOkResult_WithEvents()
    {
        // Arrange
        var events = new List<Event>
        {
            new Event { EventName = "test_event_1", Description = "Test event 1", Format = "{}", Type = "client", Tags = "[]" },
            new Event { EventName = "test_event_2", Description = "Test event 2", Format = "{}", Type = "server", Tags = "[]" }
        };

        _mockRepository.Setup(repo => repo.GetEventsAsync())
            .ReturnsAsync(events);

        // Act
        var httpContext = new DefaultHttpContext();
        var request = httpContext.Request;
        var result = await _getEvents.RunAsync(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedEvents = Assert.IsAssignableFrom<List<Event>>(okResult.Value);
        Assert.Equal(2, returnedEvents.Count);
        Assert.Equal("test_event_1", returnedEvents[0].EventName);
        Assert.Equal("test_event_2", returnedEvents[1].EventName);
    }

    [Fact]
    public async Task RunAsync_ReturnsInternalServerError_WhenExceptionOccurs()
    {
        // Arrange
        _mockRepository.Setup(repo => repo.GetEventsAsync())
            .ThrowsAsync(new Exception("Test exception"));

        // Act
        var httpContext = new DefaultHttpContext();
        var request = httpContext.Request;
        var result = await _getEvents.RunAsync(request);

        // Assert
        var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
    }
}
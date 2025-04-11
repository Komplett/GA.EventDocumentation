using Google.Apis.Auth.OAuth2;
using Google.Cloud.BigQuery.V2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Komplett.Ga.EventDocumentation.Shared;

public class BigQueryRepository : IBigQueryRepository
{
    private readonly BigQueryClient _client;
    private readonly ILogger<BigQueryRepository> _logger;
    private readonly string _projectId;
    private readonly string _datasetId;
    private readonly string _tableId;

    public BigQueryRepository(IConfiguration configuration, ILogger<BigQueryRepository> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        var serviceAccountJson = configuration["GoogleServiceAccount"] 
            ?? throw new InvalidOperationException("GoogleServiceAccount configuration is missing");
        
        _projectId = configuration["BigQuery:ProjectId"] ?? "komplett-bigquery";
        _datasetId = configuration["BigQuery:DatasetId"] ?? "ga_event_names";
        _tableId = configuration["BigQuery:TableId"] ?? "event_names";
        
        try
        {
            _client = BigQueryClient.Create(_projectId, GoogleCredential.FromJson(serviceAccountJson));
            _logger.LogInformation("BigQuery client initialized successfully for project {ProjectId}", _projectId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize BigQuery client for project {ProjectId}", _projectId);
            throw;
        }
    }
    
    public async Task<List<Event>> GetEventsAsync()
    {
        var events = new List<Event>();
        
        var query = $"SELECT * FROM `{_projectId}.{_datasetId}.{_tableId}`";
        
        try
        {
            var result = await _client.ExecuteQueryAsync(query, parameters: null);
            
            foreach (BigQueryRow row in result)
            {
                Event e = new Event
                {
                    EventName = row["event_name"]?.ToString() ?? string.Empty,
                    Description = row["description"]?.ToString() ?? string.Empty,
                    Format = row["format"]?.ToString() ?? string.Empty,
                    Type = row["type"]?.ToString() ?? string.Empty,
                    Tags = row["tags"]?.ToString() ?? string.Empty,
                };
            
                events.Add(e);
            }
            
            return events;
        }
        catch (Google.GoogleApiException ex)
        {
            _logger.LogError(ex, "BigQuery query failed: {Message}", ex.Message);
            throw new ApplicationException("Failed to retrieve events from BigQuery", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving events: {Message}", ex.Message);
            throw new ApplicationException("An unexpected error occurred while retrieving events", ex);
        }
    }
    
    public async Task UpdateEventAsync(Event updatedEvent)
    {
        if (updatedEvent == null)
        {
            throw new ArgumentNullException(nameof(updatedEvent));
        }
        
        if (string.IsNullOrEmpty(updatedEvent.EventName))
        {
            throw new ArgumentException("Event name cannot be null or empty", nameof(updatedEvent));
        }
        
        var query = @"
            UPDATE `{0}.{1}.{2}` 
            SET description = @description, 
                format = PARSE_JSON(@format), 
                type = @type, 
                tags = PARSE_JSON(@tags)  
            WHERE event_name = @eventName";
            
        query = string.Format(query, _projectId, _datasetId, _tableId);
        
        var parameters = new BigQueryParameter[]
        {
            new BigQueryParameter("eventName", BigQueryDbType.String, updatedEvent.EventName),
            new BigQueryParameter("description", BigQueryDbType.String, updatedEvent.Description ?? string.Empty),
            new BigQueryParameter("format", BigQueryDbType.String, updatedEvent.Format ?? string.Empty),
            new BigQueryParameter("type", BigQueryDbType.String, updatedEvent.Type ?? string.Empty),
            new BigQueryParameter("tags", BigQueryDbType.String, updatedEvent.Tags ?? string.Empty)
        };
        
        try
        {
            await _client.ExecuteQueryAsync(query, parameters);
        }
        catch (Google.GoogleApiException ex)
        {
            _logger.LogError(ex, "Failed to update event {EventName}: {Message}", updatedEvent.EventName, ex.Message);
            throw new ApplicationException($"Failed to update event {updatedEvent.EventName}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error updating event {EventName}: {Message}", updatedEvent.EventName, ex.Message);
            throw new ApplicationException($"An unexpected error occurred while updating event {updatedEvent.EventName}", ex);
        }
    }
}

public interface IBigQueryRepository
{
    Task<List<Event>> GetEventsAsync();
    
    Task UpdateEventAsync(Event updatedEvent);
}
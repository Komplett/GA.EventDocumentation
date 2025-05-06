namespace Komplett.Ga.EventDocumentation;

public class Event
{
    public required string EventName { get; set; }

    public string? Description { get; set; }

    public string? Format { get; set; }

    public string? Type { get; set; }

    public string? Tags { get; set; }
    
    public bool? Deprecated { get; set; }
}
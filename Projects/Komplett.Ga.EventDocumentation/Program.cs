using Komplett.Ga.EventDocumentation.Shared;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureLogging((context, builder) =>
    {
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Information);
    })
    .ConfigureServices((ctx, services) =>
    {
        services.AddSingleton<IBigQueryRepository, BigQueryRepository>();
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddHttpClient();
    })
    .Build();

host.Run();

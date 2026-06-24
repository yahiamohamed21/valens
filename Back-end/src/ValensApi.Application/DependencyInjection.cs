using Microsoft.Extensions.DependencyInjection;

namespace ValensApi.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Example service registration:
        // services.AddScoped<IYourEntityService, YourEntityService>();
        return services;
    }
}

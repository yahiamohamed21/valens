using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using ValensApi.Application.Interfaces;
using ValensApi.Application.Services;

namespace ValensApi.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IHomeControlService, HomeControlService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<ICouponService, CouponService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<ISettingService, SettingService>();
        services.AddScoped<IReturnService, ReturnService>();

        // Register all validators from this assembly
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}

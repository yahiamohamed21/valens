using ValensApi.Application;
using ValensApi.Infrastructure;
using ValensApi.API.Middleware;
using ValensApi.API.Filters;
using Microsoft.AspNetCore.Mvc;
using ValensApi.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add Clean Architecture Layers Dependency Injection
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Add Controllers and JSON configuration
builder.Services.AddControllers(options =>
    {
        options.Filters.Add<ValidationFilter>();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Suppress default validation filter to let ValidationFilter handle it custom-tailored
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddHttpContextAccessor();

// Configure OpenAPI
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new global::Microsoft.OpenApi.OpenApiInfo { Title = "Valens API", Version = "v1" });
    
    c.AddSecurityDefinition("Bearer", new global::Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = global::Microsoft.OpenApi.ParameterLocation.Header,
        Type = global::Microsoft.OpenApi.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(doc => new global::Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        {
            new global::Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", doc),
            new System.Collections.Generic.List<string>()
        }
    });
});

// Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ValensApi v1");
    });
}

app.UseHttpsRedirection();

// Use Global Exception Handling Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Enable CORS
app.UseCors("DefaultCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Serve static files for uploaded images
app.UseStaticFiles();

// Map Endpoints
app.MapControllers();

// Redirect root URL to Swagger UI in Development
if (app.Environment.IsDevelopment())
{
    app.MapGet("/", context =>
    {
        context.Response.Redirect("/swagger");
        return Task.CompletedTask;
    });
}

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DatabaseSeeder.SeedDataAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

app.Run();

using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ValensApi.API.Filters;

public class ValidationFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var parameter in context.ActionDescriptor.Parameters)
        {
            if (context.ActionArguments.TryGetValue(parameter.Name, out var argumentValue) && argumentValue != null)
            {
                var argumentType = argumentValue.GetType();
                var validatorType = typeof(IValidator<>).MakeGenericType(argumentType);
                var validator = context.HttpContext.RequestServices.GetService(validatorType) as IValidator;

                if (validator != null)
                {
                    var validationContext = new ValidationContext<object>(argumentValue);
                    var validationResult = await validator.ValidateAsync(validationContext);

                    if (!validationResult.IsValid)
                    {
                        foreach (var error in validationResult.Errors)
                        {
                            string formattedPath = ToCamelCasePath(error.PropertyName);
                            context.ModelState.AddModelError(formattedPath, error.ErrorMessage);
                        }

                        var problemDetails = new ValidationProblemDetails(context.ModelState)
                        {
                            Status = StatusCodes.Status400BadRequest,
                            Title = "One or more validation errors occurred.",
                            Detail = "Refer to the errors property for details."
                        };

                        context.Result = new BadRequestObjectResult(problemDetails);
                        return;
                    }
                }
            }
        }

        await next();
    }

    private string ToCamelCasePath(string path)
    {
        if (string.IsNullOrEmpty(path)) return path;

        var segments = path.Split('.');
        for (int i = 0; i < segments.Length; i++)
        {
            var segment = segments[i];
            int bracketIndex = segment.IndexOf('[');
            if (bracketIndex > 0)
            {
                var namePart = segment.Substring(0, bracketIndex);
                var indexPart = segment.Substring(bracketIndex);
                segments[i] = ToCamelCaseWord(namePart) + indexPart;
            }
            else
            {
                segments[i] = ToCamelCaseWord(segment);
            }
        }
        return string.Join(".", segments);
    }

    private string ToCamelCaseWord(string word)
    {
        if (string.IsNullOrEmpty(word)) return word;
        if (word.Length == 1) return word.ToLowerInvariant();
        return char.ToLowerInvariant(word[0]) + word.Substring(1);
    }
}

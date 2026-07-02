using FluentValidation;
using ValensApi.Application.DTOs.Support;

namespace ValensApi.Application.Validators;

public class SupportMessageRequestDtoValidator : AbstractValidator<SupportMessageRequestDto>
{
    public SupportMessageRequestDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email is required.")
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .MaximumLength(50);

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MaximumLength(2000);
    }
}

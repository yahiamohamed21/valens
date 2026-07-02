using FluentValidation;
using ValensApi.Application.DTOs.Customers;

namespace ValensApi.Application.Validators.Customers;

public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
{
    public UpdateProfileDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .Length(3, 100).WithMessage("Full name must be between 3 and 100 characters.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^01[0-2,5]\d{8}$").WithMessage("Invalid Egyptian phone number. Must be 11 digits starting with 010, 011, 012, or 015.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.")
            .Length(5, 200).WithMessage("Address must be between 5 and 200 characters.");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required.")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters.");
    }
}

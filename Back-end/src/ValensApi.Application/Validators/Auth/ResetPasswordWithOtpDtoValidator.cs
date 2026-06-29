using FluentValidation;
using ValensApi.Application.DTOs.Auth;

namespace ValensApi.Application.Validators.Auth;

public class ResetPasswordWithOtpDtoValidator : AbstractValidator<ResetPasswordWithOtpDto>
{
    public ResetPasswordWithOtpDtoValidator()
    {
        RuleFor(x => x.OtpCode)
            .NotEmpty().WithMessage("OTP code is required.")
            .Length(6).WithMessage("OTP code must be exactly 6 characters.")
            .Matches(@"^\d{6}$").WithMessage("OTP code must consist of exactly 6 digits.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters long.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password is required.")
            .Equal(x => x.NewPassword).WithMessage("New password and confirmation password do not match.");
    }
}

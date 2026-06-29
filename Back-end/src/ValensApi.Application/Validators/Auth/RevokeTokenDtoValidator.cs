using FluentValidation;
using ValensApi.Application.DTOs.Auth;

namespace ValensApi.Application.Validators.Auth;

public class RevokeTokenDtoValidator : AbstractValidator<RevokeTokenDto>
{
    public RevokeTokenDtoValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}

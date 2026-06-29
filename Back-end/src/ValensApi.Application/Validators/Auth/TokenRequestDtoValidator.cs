using FluentValidation;
using ValensApi.Application.DTOs.Auth;

namespace ValensApi.Application.Validators.Auth;

public class TokenRequestDtoValidator : AbstractValidator<TokenRequestDto>
{
    public TokenRequestDtoValidator()
    {
        RuleFor(x => x.AccessToken)
            .NotEmpty().WithMessage("Access token is required.");

        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}

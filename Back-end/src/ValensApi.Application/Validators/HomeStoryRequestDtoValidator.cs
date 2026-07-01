using FluentValidation;
using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Validators;

public class HomeStoryRequestDtoValidator : AbstractValidator<HomeStoryRequestDto>
{
    public HomeStoryRequestDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.Image)
            .NotEmpty().WithMessage("Image is required.")
            .Must(BeAValidUrl).WithMessage("Image must be a valid URL.");

        RuleFor(x => x.Link)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.Link))
            .WithMessage("Link must be a valid URL.");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(1).WithMessage("Display order must be at least 1.");
    }

    private bool BeAValidUrl(string url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}

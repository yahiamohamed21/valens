namespace ValensApi.Application.DTOs.Orders;

/// <summary>
/// Returned for an authenticated user so the frontend can pre-fill
/// the checkout form without asking the user to re-type their details.
/// </summary>
public class CheckoutProfileDto
{
    public string FullName    { get; set; } = string.Empty;
    public string Email       { get; set; } = string.Empty;
    public string Phone       { get; set; } = string.Empty;
    public string Address     { get; set; } = string.Empty;
    public string City        { get; set; } = string.Empty;
}

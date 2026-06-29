namespace ValensApi.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(ValensApi.Domain.Entities.User user);
    System.Security.Claims.ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}

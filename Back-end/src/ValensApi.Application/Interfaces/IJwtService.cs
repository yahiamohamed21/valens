namespace ValensApi.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(ValensApi.Domain.Entities.User user);
}

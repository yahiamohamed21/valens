using System.Threading.Tasks;
using ValensApi.Application.DTOs.Auth;

namespace ValensApi.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> RegisterAdminAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<bool> SendForgotPasswordOtpAsync(ForgotPasswordRequestDto dto);
    Task<bool> ResetPasswordWithOtpAsync(ResetPasswordWithOtpDto dto);
    Task<bool> ChangePasswordAsync(System.Guid userId, ChangePasswordDto dto);
}

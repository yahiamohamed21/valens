using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Auth;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Common;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (existingUser.Any())
        {
            return null;
        }

        var user = new User
        {
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Role = "Customer",
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City
        };

        await _unitOfWork.Users.AddAsync(user);

        var customer = new Customer
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City,
            TotalOrders = 0,
            TotalSpent = 0
        };
        await _unitOfWork.Customers.AddAsync(customer);

        await _unitOfWork.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City
        };
    }

    public async Task<AuthResponseDto?> RegisterAdminAsync(RegisterDto dto)
    {
        var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (existingUser.Any())
        {
            return null;
        }

        var user = new User
        {
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Role = "Admin",
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var users = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        var user = users.FirstOrDefault();

        if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City
        };
    }

    public async Task<bool> SendForgotPasswordOtpAsync(ForgotPasswordRequestDto dto)
    {
        var users = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        var user = users.FirstOrDefault();
        if (user == null)
        {
            return false;
        }

        var random = new System.Random();
        var otp = random.Next(100000, 999999).ToString();

        var userOtp = new UserOtp
        {
            Email = dto.Email,
            Code = otp,
            Action = "PasswordReset",
            Expiry = System.DateTimeOffset.UtcNow.AddMinutes(15),
            IsUsed = false
        };

        await _unitOfWork.UserOtps.AddAsync(userOtp);
        await _unitOfWork.SaveChangesAsync();

        await _emailService.SendOtpEmailAsync(dto.Email, otp);
        return true;
    }

    public async Task<bool> ResetPasswordWithOtpAsync(ResetPasswordWithOtpDto dto)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
        {
            return false;
        }

        var otps = await _unitOfWork.UserOtps.FindAsync(o => 
            o.Code == dto.OtpCode && 
            !o.IsUsed && 
            o.Expiry > System.DateTimeOffset.UtcNow
        );
        var otpRecord = otps.FirstOrDefault();
        if (otpRecord == null)
        {
            return false;
        }

        var users = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == otpRecord.Email.ToLower());
        var user = users.FirstOrDefault();
        if (user == null)
        {
            return false;
        }

        user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
        _unitOfWork.Users.Update(user);

        otpRecord.IsUsed = true;
        _unitOfWork.UserOtps.Update(otpRecord);

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangePasswordAsync(System.Guid userId, ChangePasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmNewPassword)
        {
            return false;
        }

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (!PasswordHasher.VerifyPassword(dto.OldPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}

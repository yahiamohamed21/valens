using System.Threading.Tasks;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IEmailService
{
    Task SendOrderConfirmationEmailAsync(Order order);
    Task SendOtpEmailAsync(string email, string code);
}

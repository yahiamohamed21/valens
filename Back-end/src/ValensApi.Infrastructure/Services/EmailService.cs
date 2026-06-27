using System;
using System.IO;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendOrderConfirmationEmailAsync(Order order)
    {
        string subject = $"Order Confirmed! Code: {order.OrderNumber}";

        // Compose Premium HTML Template
        var htmlBuilder = new StringBuilder();
        htmlBuilder.Append(@"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Order Confirmed</title>
    <style>
        body {
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            background-color: #0b0f19;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #111827;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #1f2937;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #ff8a75 0%, #ff5226 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 16px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 30px;
        }
        .welcome-text strong {
            color: #ffffff;
        }
        .order-meta {
            background-color: #1f2937;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid #374151;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .meta-row:last-child {
            margin-bottom: 0;
        }
        .meta-label {
            color: #9ca3af;
        }
        .meta-value {
            font-weight: 600;
            color: #ffffff;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            text-align: left;
            padding-bottom: 12px;
            border-bottom: 1px solid #374151;
            color: #9ca3af;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table td {
            padding: 16px 0;
            border-bottom: 1px solid #1f2937;
            font-size: 14px;
        }
        .item-name {
            font-weight: 600;
            color: #ffffff;
        }
        .item-desc {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
        }
        .item-qty {
            color: #9ca3af;
            text-align: center;
        }
        .item-price {
            text-align: right;
            font-weight: 600;
            color: #ffffff;
        }
        .totals-section {
            border-top: 1px solid #374151;
            padding-top: 20px;
            margin-bottom: 30px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .total-row.grand-total {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #1f2937;
            font-size: 18px;
            font-weight: 800;
            color: #ff8a75;
        }
        .total-label {
            color: #9ca3af;
        }
        .total-value {
            color: #ffffff;
            font-weight: 600;
        }
        .shipping-card {
            background-color: #1f2937;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #374151;
            margin-bottom: 30px;
        }
        .shipping-title {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 0;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        .shipping-text {
            font-size: 14px;
            line-height: 1.6;
            color: #9ca3af;
            margin: 0;
        }
        .cod-banner {
            background-color: rgba(255, 138, 117, 0.1);
            border: 1px solid rgba(255, 138, 117, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }
        .cod-title {
            font-size: 16px;
            font-weight: 700;
            color: #ff8a75;
            margin: 0 0 8px 0;
            text-transform: uppercase;
        }
        .cod-text {
            font-size: 13px;
            color: #9ca3af;
            margin: 0;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            padding: 30px;
            background-color: #0b0f19;
            border-top: 1px solid #1f2937;
        }
        .footer p {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #6b7280;
        }
        .footer a {
            color: #ff8a75;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class='wrapper'>
        <div class='container'>
            <div class='header'>
                <h1>Order Confirmed</h1>
            </div>
            <div class='content'>
                <div class='welcome-text'>
                    Hi <strong>" + order.CustomerName + @"</strong>,<br/><br/>
                    Great news! Your premium Valens order has been confirmed by our team and is now being packed. We will ship it directly to your address.
                </div>
                
                <div class='order-meta'>
                    <div class='meta-row'>
                        <div class='meta-label'>Order Code</div>
                        <div class='meta-value'>" + order.OrderNumber + @"</div>
                    </div>
                    <div class='meta-row'>
                        <div class='meta-label'>Date</div>
                        <div class='meta-value'>" + order.CreatedAt.ToString("MMMM dd, yyyy") + @"</div>
                    </div>
                    <div class='meta-row'>
                        <div class='meta-label'>Payment Method</div>
                        <div class='meta-value'>Cash on Delivery (COD)</div>
                    </div>
                </div>

                <table class='items-table'>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style='text-align: center;'>Qty</th>
                            <th style='text-align: right;'>Price</th>
                        </tr>
                    </thead>
                    <tbody>");

        foreach (var item in order.Items)
        {
            string variantDesc = string.IsNullOrEmpty(item.VariantId) ? "" : $" ({item.Size} / {item.Flavor})";
            htmlBuilder.Append(@"
                        <tr>
                            <td>
                                <div class='item-name'>" + item.ProductName + @"</div>
                                <div class='item-desc'>" + variantDesc + @"</div>
                            </td>
                            <td class='item-qty'>" + item.Quantity + @"</td>
                            <td class='item-price'>" + (item.Price * item.Quantity).ToString("N2") + @" EGP</td>
                        </tr>");
        }

        htmlBuilder.Append(@"
                    </tbody>
                </table>

                <div class='totals-section'>
                    <div class='total-row'>
                        <div class='total-label'>Subtotal</div>
                        <div class='total-value'>" + order.Subtotal.ToString("N2") + @" EGP</div>
                    </div>");

        if (order.DiscountAmount > 0)
        {
            htmlBuilder.Append(@"
                    <div class='total-row'>
                        <div class='total-label'>Discount (" + order.CouponCode + @")</div>
                        <div class='total-value' style='color: #ef4444;'>-" + order.DiscountAmount.ToString("N2") + @" EGP</div>
                    </div>");
        }

        htmlBuilder.Append(@"
                    <div class='total-row'>
                        <div class='total-label'>Shipping Cost</div>
                        <div class='total-value'>" + order.ShippingCost.ToString("N2") + @" EGP</div>
                    </div>
                    <div class='total-row grand-total'>
                        <div>Total Amount</div>
                        <div>" + order.Total.ToString("N2") + @" EGP</div>
                    </div>
                </div>

                <div class='shipping-card'>
                    <h3 class='shipping-title'>Delivery Address</h3>
                    <p class='shipping-text'>
                        <strong>Address:</strong> " + order.ShippingAddress + @"<br/>
                        <strong>City:</strong> " + order.ShippingCity + @"<br/>
                        <strong>Phone:</strong> " + order.CustomerPhone + @"
                    </p>
                </div>

                <div class='cod-banner'>
                    <h4 class='cod-title'>Cash On Delivery</h4>
                    <p class='cod-text'>
                        Please prepare exactly <strong>" + order.Total.ToString("N2") + @" EGP</strong> to pay the courier upon delivery. 
                        No online pre-payment is required.
                    </p>
                </div>
            </div>
            <div class='footer'>
                <p>&copy; " + DateTime.UtcNow.Year + @" Valens Supplements. All rights reserved.</p>
                <p>Need support? Contact us at <a href='mailto:support@valens.com'>support@valens.com</a></p>
            </div>
        </div>
    </div>
</body>
</html>");

        string htmlContent = htmlBuilder.ToString();

        // 1. Output to Debug Console
        Console.WriteLine($"[EMAIL SENT TO {order.CustomerEmail}]:\nSubject: {subject}\nBody: {htmlContent.Substring(0, Math.Min(200, htmlContent.Length))}...");

        // 2. Save HTML file for visual verification in browser
        try
        {
            string emailsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emails");
            if (!Directory.Exists(emailsFolder))
            {
                Directory.CreateDirectory(emailsFolder);
            }
            string htmlPath = Path.Combine(emailsFolder, $"{order.OrderNumber}.html");
            await File.WriteAllTextAsync(htmlPath, htmlContent, Encoding.UTF8);
            Console.WriteLine($"Saved order confirmation email for review: {htmlPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to write HTML file for preview: {ex.Message}");
        }

        // 3. Fallback: SMTP Send if configured in appsettings.json
        try
        {
            var host = _configuration["Smtp:Host"];
            var portStr = _configuration["Smtp:Port"];
            if (!string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(portStr))
            {
                int port = int.Parse(portStr);
                string username = _configuration["Smtp:Username"] ?? "";
                string password = _configuration["Smtp:Password"] ?? "";
                string fromAddress = _configuration["Smtp:FromAddress"] ?? "no-reply@valens.com";

                using var mail = new MailMessage();
                mail.From = new MailAddress(fromAddress, "Valens Supplements");
                mail.To.Add(new MailAddress(order.CustomerEmail));
                mail.Subject = subject;
                mail.Body = htmlContent;
                mail.IsBodyHtml = true;

                using var smtp = new SmtpClient(host, port);
                if (!string.IsNullOrEmpty(username))
                {
                    smtp.Credentials = new System.Net.NetworkCredential(username, password);
                }
                smtp.EnableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl");

                await smtp.SendMailAsync(mail);
                Console.WriteLine($"SMTP Order confirmation email sent to {order.CustomerEmail}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SMTP Send skipped/failed: {ex.Message}");
        }
    }

    public async Task SendOtpEmailAsync(string email, string code)
    {
        string subject = $"Your One-Time Password (OTP) code: {code}";

        var html = $@"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Reset Password OTP</title>
    <style>
        body {{
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
        }}
        .wrapper {{
            background-color: #0b0f19;
            padding: 40px 20px;
        }}
        .container {{
            max-width: 500px;
            margin: 0 auto;
            background-color: #111827;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #1f2937;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }}
        .header {{
            background: linear-gradient(135deg, #ff8a75 0%, #ff5226 100%);
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
            text-transform: uppercase;
        }}
        .content {{
            padding: 40px 30px;
            text-align: center;
        }}
        .instruction {{
            font-size: 16px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 30px;
        }}
        .otp-box {{
            background-color: #1f2937;
            border: 2px dashed #ff8a75;
            border-radius: 12px;
            padding: 20px;
            display: inline-block;
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 5px;
            margin-bottom: 30px;
        }}
        .warning {{
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
            line-height: 1.5;
        }}
        .footer {{
            text-align: center;
            padding: 20px;
            background-color: #0b0f19;
            border-top: 1px solid #1f2937;
            font-size: 11px;
            color: #4b5563;
        }}
    </style>
</head>
<body>
    <div class='wrapper'>
        <div class='container'>
            <div class='header'>
                <h1>Password Reset OTP</h1>
            </div>
            <div class='content'>
                <p class='instruction'>
                    We received a request to reset your password. Use the verification code below to proceed. This code is valid for 15 minutes.
                </p>
                <div class='otp-box'>
                    {code}
                </div>
                <p class='warning'>
                    If you did not request this password reset, please ignore this email or contact support if you suspect unauthorized access.
                </p>
            </div>
            <div class='footer'>
                <p>&copy; {DateTime.UtcNow.Year} Valens Supplements. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>";

        // 1. Output to Debug Console
        Console.WriteLine($"[OTP EMAIL SENT TO {email}]: code {code}");

        // 2. Save HTML file for visual verification in browser
        try
        {
            string emailsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emails");
            if (!Directory.Exists(emailsFolder))
            {
                Directory.CreateDirectory(emailsFolder);
            }
            string htmlPath = Path.Combine(emailsFolder, $"OTP-{email.Replace("@", "_").Replace(".", "_")}.html");
            await File.WriteAllTextAsync(htmlPath, html, Encoding.UTF8);
            Console.WriteLine($"Saved OTP email for review: {htmlPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to write OTP HTML file for preview: {ex.Message}");
        }

        // 3. Fallback: SMTP Send if configured in appsettings.json
        try
        {
            var host = _configuration["Smtp:Host"];
            var portStr = _configuration["Smtp:Port"];
            if (!string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(portStr))
            {
                int port = int.Parse(portStr);
                string username = _configuration["Smtp:Username"] ?? "";
                string password = _configuration["Smtp:Password"] ?? "";
                string fromAddress = _configuration["Smtp:FromAddress"] ?? "no-reply@valens.com";

                using var mail = new MailMessage();
                mail.From = new MailAddress(fromAddress, "Valens Supplements");
                mail.To.Add(new MailAddress(email));
                mail.Subject = subject;
                mail.Body = html;
                mail.IsBodyHtml = true;

                using var smtp = new SmtpClient(host, port);
                if (!string.IsNullOrEmpty(username))
                {
                    smtp.Credentials = new System.Net.NetworkCredential(username, password);
                }
                smtp.EnableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl");

                await smtp.SendMailAsync(mail);
                Console.WriteLine($"SMTP OTP sent to {email}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SMTP Send skipped/failed: {ex.Message}");
        }
    }
}

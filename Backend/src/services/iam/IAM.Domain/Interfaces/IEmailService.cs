namespace IAM.Domain.Interfaces;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string subject, string body);
}

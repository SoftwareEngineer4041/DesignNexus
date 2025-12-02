using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpEmailAsync(string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_config["Smtp:FromName"], _config["Smtp:FromEmail"]));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = body };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]), false);
        await client.AuthenticateAsync(_config["Smtp:Username"], _config["Smtp:Password"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}

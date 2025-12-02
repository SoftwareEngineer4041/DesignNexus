using IAM.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Text.Json;

public class RedisOtpService : IOtpService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisOtpService> _logger;
    private readonly IEmailService _emailService;
    private const int OtpExpirationMinutes = 5;
    private const int OtpLength = 6;

    public RedisOtpService(IDistributedCache cache, ILogger<RedisOtpService> logger, IEmailService emailService)
    {
        _cache = cache;
        _logger = logger;
        _emailService = emailService;
    }

    public async Task<string> GenerateOtpAsync(string email)
    {
        var rnd = new Random();
        var otp = rnd.Next((int)Math.Pow(10, OtpLength-1), (int)Math.Pow(10, OtpLength)).ToString();

        var cacheKey = $"otp:{email}";
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(OtpExpirationMinutes)
        };

        await _cache.SetStringAsync(cacheKey, otp, options);

        // ارسال ایمیل
        var subject = "کد تایید شما";
        var body = $"کد تایید شما: <b>{otp}</b>. این کد تا {OtpExpirationMinutes} دقیقه معتبر است.";
        try
        {
            await _emailService.SendOtpEmailAsync(email, subject, body);
            _logger.LogInformation($"OTP sent to {email}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send OTP email");
            // تصمیم بگیر: آیا باید OTP را از cache حذف کنیم یا نه؟ فعلاً نگه می‌داریم ولی می‌توان حذف کرد.
        }

        return otp; // برای تست می‌توانیم OTP را برگردانیم (در پروداکشن معمولاً برنمی‌گردانیم)
    }

    public async Task<bool> ValidateOtpAsync(string email, string otp)
    {
        var cacheKey = $"otp:{email}";
        var storedOtp = await _cache.GetStringAsync(cacheKey);
        var isValid = storedOtp != null && storedOtp == otp;

        if (isValid)
        {
            await _cache.RemoveAsync(cacheKey);
            _logger.LogInformation($"OTP validated for {email}");
        }
        else
        {
            _logger.LogWarning($"Invalid OTP for {email}: {otp} (expected: {storedOtp})");
        }

        return isValid;
    }
}

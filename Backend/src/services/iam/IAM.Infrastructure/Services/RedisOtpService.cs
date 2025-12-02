using System;
using System.Threading.Tasks;
using IAM.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace IAM.Infrastructure.Services
{
    public class RedisOtpService : IOtpService
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<RedisOtpService> _logger;
        private const int OtpExpirationMinutes = 5;
        private const int OtpLength = 6;

        public RedisOtpService(IDistributedCache cache, ILogger<RedisOtpService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<string> GenerateOtpAsync(string email)
        {
            // تولید OTP تصادفی 6 رقمی
            var random = new Random();
            var otp = random.Next(100000, 999999).ToString();

            // ذخیره OTP در Redis با کلید email
            var cacheKey = $"otp:{email.ToLower()}";
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(OtpExpirationMinutes)
            };

            await _cache.SetStringAsync(cacheKey, otp, options);
            
            _logger.LogInformation($"Generated OTP for {email}: {otp}");
            
            return otp;
        }

        public async Task<bool> ValidateOtpAsync(string email, string otp)
        {
            var cacheKey = $"otp:{email.ToLower()}";
            var storedOtp = await _cache.GetStringAsync(cacheKey);

            if (string.IsNullOrEmpty(storedOtp))
            {
                _logger.LogWarning($"No OTP found for {email}");
                return false;
            }

            var isValid = storedOtp == otp;
            
            if (isValid)
            {
                // حذف OTP بعد از استفاده موفق
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
}
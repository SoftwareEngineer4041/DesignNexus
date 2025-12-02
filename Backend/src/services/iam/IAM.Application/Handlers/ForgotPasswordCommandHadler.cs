using System.Threading;
using System.Threading.Tasks;
using IAM.Application.Commands;
using IAM.Application.DTOs;
using IAM.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace IAM.Application.Handlers
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, BaseResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IOtpService _otpService;
        private readonly ILogger<ForgotPasswordCommandHandler> _logger;

        public ForgotPasswordCommandHandler(
            IUserRepository userRepository,
            IOtpService otpService,
            ILogger<ForgotPasswordCommandHandler> logger)
        {
            _userRepository = userRepository;
            _otpService = otpService;
            _logger = logger;
        }

        public async Task<BaseResponseDto> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var request = command.Request;

            // بررسی وجود کاربر
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                // برای امنیت، همیشه پیام یکسان برگردان
                _logger.LogWarning($"Forgot password attempt for non-existing email: {request.Email}");
                return BaseResponseDto.SuccessResponse("اگر ایمیل در سیستم وجود داشته باشد، کد بازیابی ارسال خواهد شد");
            }

            // ایجاد OTP برای بازیابی رمز عبور
            var otp = await _otpService.GenerateOtpAsync(request.Email);
            
            // در اینجا باید OTP را ایمیل کنید
            _logger.LogInformation($"Password reset OTP for {request.Email}: {otp}");

            return BaseResponseDto.SuccessResponse("کد بازیابی رمز عبور ارسال شد");
        }
    }
}
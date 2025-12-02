using System.Threading;
using System.Threading.Tasks;
using IAM.Application.Commands;
using IAM.Application.DTOs;
using IAM.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace IAM.Application.Handlers
{
    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, BaseResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IOtpService _otpService;
        private readonly ILogger<ResetPasswordCommandHandler> _logger;

        public ResetPasswordCommandHandler(
            IUserRepository userRepository,
            IOtpService otpService,
            ILogger<ResetPasswordCommandHandler> logger)
        {
            _userRepository = userRepository;
            _otpService = otpService;
            _logger = logger;
        }

        public async Task<BaseResponseDto> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            var request = command.Request;

            // اعتبارسنجی OTP
            var isValidOtp = await _otpService.ValidateOtpAsync(request.Email, request.Otp);
            if (!isValidOtp)
            {
                return BaseResponseDto.FailureResponse("کد OTP نامعتبر یا منقضی شده است");
            }

            // پیدا کردن کاربر
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return BaseResponseDto.FailureResponse("کاربر پیدا نشد");
            }

            // هش کردن رمز عبور جدید
            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            
            // به‌روزرسانی رمز عبور
            user.UpdatePassword(newPasswordHash);
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation($"Password reset successful for user: {user.Email}");

            return BaseResponseDto.SuccessResponse("رمز عبور با موفقیت تغییر کرد");
        }
    }
}
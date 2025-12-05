using System;
using System.Threading;
using System.Threading.Tasks;
using IAM.Application.Commands;
using IAM.Application.DTOs;
using IAM.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace IAM.Application.Handlers
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, AuthResponseDto>
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

        public async Task<AuthResponseDto> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var request = command.Request;
                if (!await _userRepository.EmailExistsAsync(request.Email))
                {
                    _logger.LogInformation($"Email: {request.Email} not found");
                    return AuthResponseDto.FailureResponse("ایمیل اشتباه است");
                }
                
                await _otpService.GenerateOtpAsync(request.Email);

                var user = await _userRepository.GetByEmailAsync(request.Email);

                return AuthResponseDto.SuccessResponse(
                    "کد تایید دوباره برایتان ارسال شد",
                    string.Empty,
                    new UserDto
                    {
                        UserId = user!.UserId,
                        FullName = user.FullName,
                        Email = user.Email,
                        Role = user.Role,
                        IsVerified = user.IsVerified
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in update password");
                return AuthResponseDto.FailureResponse("خطا در تغییر رمز. لطفاً مجدداً تلاش کنید");
            }
        }
    }
}
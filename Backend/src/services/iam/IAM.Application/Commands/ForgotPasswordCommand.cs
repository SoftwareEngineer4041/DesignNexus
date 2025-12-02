using IAM.Application.DTOs;
using MediatR;

namespace IAM.Application.Commands
{
    public class ForgotPasswordCommand : IRequest<BaseResponseDto>
    {
        public ForgotPasswordRequestDto Request { get; }

        public ForgotPasswordCommand(ForgotPasswordRequestDto request)
        {
            Request = request;
        }
    }
}
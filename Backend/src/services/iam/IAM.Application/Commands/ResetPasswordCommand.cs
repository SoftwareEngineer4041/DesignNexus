using IAM.Application.DTOs;
using MediatR;

namespace IAM.Application.Commands
{
    public class ResetPasswordCommand : IRequest<BaseResponseDto>
    {
        public ResetPasswordRequestDto Request { get; }

        public ResetPasswordCommand(ResetPasswordRequestDto request)
        {
            Request = request;
        }
    }
}
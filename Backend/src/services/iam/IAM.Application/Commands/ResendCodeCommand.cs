using IAM.Application.DTOs;
using MediatR;

namespace IAM.Application.Commands
{
    public class ResendCodeCommand : IRequest<AuthResponseDto>
    {
        public ResendCodeRequestDto Request { get; }

        public ResendCodeCommand(ResendCodeRequestDto request)
        {
            Request = request;
        }
    }
}

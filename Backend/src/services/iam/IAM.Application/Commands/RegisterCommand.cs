using IAM.Application.DTOs;
using MediatR;

namespace IAM.Application.Commands
{
    public class RegisterCommand : IRequest<AuthResponseDto>
    {
        public RegisterRequestDto Request { get; }

        public RegisterCommand(RegisterRequestDto request)
        {
            Request = request;
        }
    }
}
using System.Threading.Tasks;
using IAM.Application.Commands;
using IAM.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IAM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IMediator mediator, ILogger<AuthController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            _logger.LogInformation($"Register attempt for email: {request.Email}");
            
            var command = new RegisterCommand(request);
            var result = await _mediator.Send(command);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto request)
        {
            _logger.LogInformation($"OTP verification attempt for email: {request.Email}");
            
            var command = new VerifyOtpCommand(request);
            var result = await _mediator.Send(command);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            _logger.LogInformation($"Login attempt for email: {request.Email}");
            
            var command = new LoginCommand(request);
            var result = await _mediator.Send(command);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return Unauthorized(result);
        }

    }
}
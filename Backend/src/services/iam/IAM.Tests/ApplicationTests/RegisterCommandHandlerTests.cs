using System.Threading;
using System.Threading.Tasks;
using IAM.Application.Commands;
using IAM.Application.DTOs;
using IAM.Application.Handlers;
using IAM.Domain.Entities;
using IAM.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace IAM.Tests.ApplicationTests
{
    public class RegisterCommandHandlerTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IOtpService> _mockOtpService;
        private readonly Mock<ILogger<RegisterCommandHandler>> _mockLogger;
        private readonly RegisterCommandHandler _handler;

        public RegisterCommandHandlerTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockOtpService = new Mock<IOtpService>();
            _mockLogger = new Mock<ILogger<RegisterCommandHandler>>();
            
            _handler = new RegisterCommandHandler(
                _mockUserRepository.Object,
                _mockOtpService.Object,
                _mockLogger.Object
            );
        }

        [Fact]
        public async Task Handle_WhenEmailExists_ReturnsFailure()
        {
            // Arrange
            var request = new RegisterRequestDto
            {
                Email = "test@example.com",
                Password = "Password123",
                ConfirmPassword = "Password123",
                FullName = "Test User",
                Role = "User"
            };

            _mockUserRepository
                .Setup(r => r.EmailExistsAsync(request.Email))
                .ReturnsAsync(true);

            var command = new RegisterCommand(request);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("این ایمیل قبلاً ثبت شده است", result.Message);
        }

        [Fact]
        public async Task Handle_WhenValidRequest_ReturnsSuccess()
        {
            // Arrange
            var request = new RegisterRequestDto
            {
                Email = "newuser@example.com",
                Password = "Password123",
                ConfirmPassword = "Password123",
                FullName = "New User",
                Role = "User"
            };

            _mockUserRepository
                .Setup(r => r.EmailExistsAsync(request.Email))
                .ReturnsAsync(false);

            _mockOtpService
                .Setup(s => s.GenerateOtpAsync(request.Email))
                .ReturnsAsync("123456");

            var command = new RegisterCommand(request);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.User);
            Assert.Equal(request.Email, result.User.Email);
        }
    }
}
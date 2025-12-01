using IAM.Domain.Entities;
using System.Threading.Tasks;

namespace IAM.Domain.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateTokenAsync(User user);
        Task<bool> ValidateTokenAsync(string token);
        Task<string> GetUserIdFromTokenAsync(string token);
    }
}
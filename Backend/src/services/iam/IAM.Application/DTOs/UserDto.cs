namespace IAM.Application.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }
        public bool IsVerified { get; set; }
    }
}
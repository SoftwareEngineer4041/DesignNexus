using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        public required string Password { get; set; }
    }
}
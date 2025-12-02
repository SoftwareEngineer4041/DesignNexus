using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class ForgotPasswordRequestDto
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public string Email { get; set; }
    }
}
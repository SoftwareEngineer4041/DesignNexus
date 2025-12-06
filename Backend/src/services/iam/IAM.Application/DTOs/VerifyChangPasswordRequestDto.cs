using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class VerifyChangePasswordRequestDto
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "کد OTP الزامی است")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "کد OTP باید 6 رقمی باشد")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "کد OTP باید فقط شامل اعداد باشد")]
        public required string Otp { get; set; }
    }
}
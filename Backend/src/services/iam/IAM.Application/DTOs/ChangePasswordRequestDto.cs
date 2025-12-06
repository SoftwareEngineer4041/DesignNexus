using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        [MinLength(8, ErrorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "تکرار رمز عبور الزامی است")]
        [Compare(nameof(Password), ErrorMessage = "رمز عبور و تکرار آن مطابقت ندارند")]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "کد OTP الزامی است")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "کد OTP باید 6 رقمی باشد")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "کد OTP باید فقط شامل اعداد باشد")]
        public required string Otp { get; set; }
    }
}
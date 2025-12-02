using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class ResetPasswordRequestDto
    {
        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public string Email { get; set; }

        [Required(ErrorMessage = "کد OTP الزامی است")]
        [StringLength(6, MinimumLength = 6)]
        public string Otp { get; set; }

        [Required(ErrorMessage = "رمز عبور جدید الزامی است")]
        [MinLength(8, ErrorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "تکرار رمز عبور الزامی است")]
        [Compare(nameof(NewPassword), ErrorMessage = "رمز عبور و تکرار آن مطابقت ندارند")]
        public string ConfirmNewPassword { get; set; }
    }
}
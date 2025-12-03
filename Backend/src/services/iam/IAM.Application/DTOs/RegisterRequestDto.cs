using System.ComponentModel.DataAnnotations;

namespace IAM.Application.DTOs
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "نام کامل الزامی است")]
        [StringLength(100, ErrorMessage = "نام کامل نمی‌تواند بیش از 100 کاراکتر باشد")]
        public required string FullName { get; set; }

        [Required(ErrorMessage = "ایمیل الزامی است")]
        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        [StringLength(150, ErrorMessage = "ایمیل نمی‌تواند بیش از 150 کاراکتر باشد")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        [MinLength(8, ErrorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "تکرار رمز عبور الزامی است")]
        [Compare(nameof(Password), ErrorMessage = "رمز عبور و تکرار آن مطابقت ندارند")]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "نقش کاربر الزامی است")]
        [RegularExpression("^(طراح|کاربر)$", ErrorMessage = "نقش نامعتبر است")]
        public string Role { get; set; } = "کاربر";
    }
}
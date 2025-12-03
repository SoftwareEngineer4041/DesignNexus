import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup_page.css";
import design_img from "../assets/design_img.png";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "کاربر",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // وقتی کاربر وارد میشه، می‌تونیم touched رو پاک کنیم برای اون فیلد
    setTouched((prev) => ({ ...prev, [e.target.name]: false }));
    setError("");
  };

  const validateEmpty = () => {
    const emptyFields = Object.keys(form).filter(
      (key) => (form as any)[key].trim() === ""
    );

    if (emptyFields.length > 0) {
      setError("لطفاً تمام فیلدها را پر کنید");
      setTouched(
        emptyFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as any)
      );
      return false;
    }

    // بررسی تطابق رمز و تکرارش
    if (form.password !== form.confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند");
      setTouched({ password: true, confirmPassword: true });
      return false;
    }

    return true;
  };

  const handleGoVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
    setError("");

    if (!validateEmpty()) {
      return;
    }

    setLoading(true);

    const payload = {
      fullName: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: form.role,
    };

    try {
      const response = await fetch("http://localhost:5209/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("payload:", payload);
      console.log("server response:", data);

      // مسیردهی فقط وقتی سرور OK هست (کد 200-299) یا وقتی بدنه پاسخ یک فیلد success داره
      if (response.ok) {
        // اگر می‌خواهی پیام موفقیت نمایش بدی:
        // setError("ثبت‌نام موفق! لطفاً کد تایید ایمیل را وارد کنید");
        // سپس نِویگیت کن
        localStorage.setItem("signupEmail", form.email);
        navigate("/verify", { state: { email: form.email } });
      } else {
        // خطا از سمت سرور؛ متن خطا رو از پاسخ نمایش بده (اگر موجود باشه)
        // const serverMessage = data?.message || "مشکلی در ثبت‌نام پیش آمد";
        // setError(serverMessage);   
        if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0]; // مثل "Password"
    const firstMessage = data.errors[firstKey][0]; // مثل "رمز عبور باید حداقل 8 کاراکتر باشد"

    setError(firstMessage);
  } else if (data?.message) {
    setError(data.message);
  } else {
    setError("خطای نامشخصی رخ داده");
  }

  return;                                                                                  
      }
    } catch (err) {
      console.error("Error sending signup data:", err);
      setError("اتصال به سرور برقرار نشد. دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={(e) => e.preventDefault()}>
        <img src={design_img} className="design_image" alt="design" />

        {error && <p className="signup-error">{error}</p>}

        <input
          className="signup-input"
          style={{ borderColor: touched.firstName ? "red" : "#ccc" }}
          type="text"
          name="firstName"
          placeholder="نام"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          className="signup-input"
          style={{ borderColor: touched.lastName ? "red" : "#ccc" }}
          type="text"
          name="lastName"
          placeholder="نام خانوادگی"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          className="signup-input"
          style={{ borderColor: touched.email ? "red" : "#ccc" }}
          type="email"
          name="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={handleChange}
        />

        <select
          className="signup-input"
          style={{ borderColor: touched.role ? "red" : "#ccc" }}
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="کاربر">کاربر</option>
          <option value="طراح">طراح</option>
        </select>

        <input
          className="signup-input"
          style={{ borderColor: touched.password ? "red" : "#ccc" }}
          type="password"
          name="password"
          placeholder="رمزعبور"
          value={form.password}
          onChange={handleChange}
        />

        <input
          className="signup-input"
          style={{ borderColor: touched.confirmPassword ? "red" : "#ccc" }}
          type="password"
          name="confirmPassword"
          placeholder="تکرار رمزعبور"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {/* دکمه‌ای که فقط وقتی جواب موفق از سرور اومد navigate می‌کنه */}
        <button
          type="button"
          className="signup-button"
          onClick={handleGoVerify}
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ثبت نام"}
        </button>

        <p className="signup-link">
          حساب دارید؟ <Link to="/login">وارد شوید</Link>
        </p>
      </form>
    </div>
  );
}

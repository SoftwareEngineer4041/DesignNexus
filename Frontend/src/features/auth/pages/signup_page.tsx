import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup_page.css";
import design_img from "../assets/design_img.png";

import {
  registerUser,
  type RegisterForm,
} from "../API/authAPI";

interface SignupFormUI {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupFormUI>({
    firstName: "",
    lastName: "",
    email: "",
    role: "کاربر",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouched((prev) => ({ ...prev, [name]: false }));
    setError("");
  };

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateFields = () => {
    const emptyFields = Object.keys(form).filter(
      (key) => (form as any)[key].trim() === ""
    );

    if (emptyFields.length > 0) {
      setError("لطفاً تمام فیلدها را پر کنید");

      setTouched(
        emptyFields.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>)
      );

      return false;
    }

    if (!validateEmail(form.email)) {
      setError("ایمیل معتبر نیست");
      setTouched((prev) => ({ ...prev, email: true }));
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیست");
      setTouched({ password: true, confirmPassword: true });
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) return;

    setLoading(true);

    try {
      const payload: RegisterForm = {
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role
      };

      const response = await registerUser(payload);

      console.log("Signup success:", response);

      localStorage.setItem("signupEmail", form.email);

      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "خطای ناشناخته‌ای رخ داده");
      } else {
        setError("خطای ناشناخته‌ای رخ داده");
      }
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
          placeholder="رمز عبور"
          value={form.password}
          onChange={handleChange}
        />

        <input
          className="signup-input"
          style={{ borderColor: touched.confirmPassword ? "red" : "#ccc" }}
          type="password"
          name="confirmPassword"
          placeholder="تکرار رمز عبور"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="button"
          className="signup-button"
          onClick={handleSignup}
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

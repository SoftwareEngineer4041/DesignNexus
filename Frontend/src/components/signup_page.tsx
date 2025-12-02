import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/signup_page.css";
import design_img from "../assets/design_img.png"

export default function SignupPage() {
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role:"کاربر",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmpty = () => {
    const emptyFields = Object.keys(form).filter(
      (key) => form[key as keyof typeof form].trim() === ""
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
    return true;
  };

  const handleGoVerify = (e: React.MouseEvent) => {
    if (!validateEmpty()) {
      e.preventDefault(); // جلوگیری از رفتن به صفحه verify
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card">
        <img src={design_img} className="design_image" />

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

        <Link
          to="/verify"
          className="signup-button"
          onClick={handleGoVerify}
        >
          ورود
        </Link>

        <p className="signup-link">
          حساب دارید؟ <Link to="/login">وارد شوید</Link>
        </p>
      </form>
    </div>
  );
}

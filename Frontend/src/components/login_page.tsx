import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login_page.css";
import design_img from "../assets/design_img.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const newErrors = {
      email: form.email.trim() === "",
      password: form.password.trim() === "",
    };

    setFieldErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("ایمیل یا رمز عبور اشتباه است");

      const data = await res.json();
      console.log(data);
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src={design_img} className="design_image" alt="design" />

        {error && <p className="login-error">{error}</p>}

        <input
          className={`login-input ${fieldErrors.email ? "input-error" : ""}`}
          type="email"
          name="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className={`login-input ${fieldErrors.password ? "input-error" : ""}`}
          type="password"
          name="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={handleChange}
        />

        <p className="forget-link">
          <Link to="/forgot-password">فراموشی رمز عبور</Link>
        </p>

        <button className="login-button" disabled={loading}>
          {loading ? "لطفا صبر کنید" : "ورود"}
        </button>

        <p className="login-link">
          حساب ندارید؟ <Link to="/signup">ثبت‌نام کنید</Link>
        </p>
      </form>
    </div>
  );
}

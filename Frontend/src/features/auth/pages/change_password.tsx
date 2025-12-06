import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/change_password.css";
import { changePassword, type ChangePasswordPayload } from "../API/authAPI";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const email = localStorage.getItem("reset_email") || "";
  const otp = localStorage.getItem("otp") || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("ایمیل یا کد OTP یافت نشد.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیست!");
      return;
    }

    try {
      setLoading(true);

      const payload: ChangePasswordPayload = {
        email,
        otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      await changePassword(payload);

      setSuccess("رمز عبور با موفقیت تغییر کرد!");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("otp");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-pass-container">
      <form className="change-pass-form" onSubmit={handleSubmit}>
        <h2>تغییر رمز عبور</h2>

        <label>رمز عبور جدید</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>تکرار رمز عبور جدید</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال ارسال..." : "تغییر رمز"}
        </button>
      </form>
    </div>
  );
}

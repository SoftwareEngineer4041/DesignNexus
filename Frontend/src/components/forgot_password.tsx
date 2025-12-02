import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forgot_password.css";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("لطفاً ایمیل را وارد کنید.");
      return;
    }

    if (!validateEmail(email)) {
      setError("ایمیل نامعتبر است.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("ارسال لینک با مشکل مواجه شد.");
      }

      setSuccess("اگر ایمیل شما ثبت شده باشد، لینک بازنشانی ارسال خواهد شد.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pr-page" dir="rtl">
      <div className="pr-card">

        <h1 className="pr-title">فراموشی رمز عبور</h1>
        <p className="pr-sub">
          ایمیل خود را وارد کنید تا لینک بازنشانی برایتان ارسال شود.
        </p>

        <form className="pr-form" onSubmit={handleSubmit} noValidate>
          <label className="pr-label" htmlFor="email">
            ایمیل
          </label>

          <input
            id="email"
            type="email"
            className="pr-input"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="pr-error">{error}</p>}
          {success && <p className="pr-success">{success}</p>}

          <button type="submit" className="pr-button" disabled={loading}>
            {loading ? "در حال ارسال..." : "ارسال لینک"}
          </button>
        </form>

        <div className="pr-footer">
          <Link className="pr-link" to="/login">
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </div>
  );
}

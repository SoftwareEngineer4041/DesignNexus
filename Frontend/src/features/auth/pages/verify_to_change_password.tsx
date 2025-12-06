import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/verify_to_change_password.css";
import design_img from "../assets/design_img.png";

import {
  verifyCodeToChangePassword,
  type VerifyPayload,
  type ResendCodePayload,
  resendCodeToChangePassword,
} from "../API/authAPI";

export default function VerifyToChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(300); // 5 دقیقه

  useEffect(() => {
    const stateEmail = (location.state as any)?.email;
    const savedEmail = localStorage.getItem("userEmailToChangePass");

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("userEmailToChangePass", stateEmail);
    } else if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setError("ایمیل کاربر یافت نشد. لطفاً دوباره ثبت‌نام کنید.");
    }
  }, [location.state]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("ایمیل کاربر مشخص نیست.");
      return;
    }

    if (code.trim().length === 0) {
      setError("کد تأیید را وارد کنید");
      return;
    }

    setLoading(true);

    const payload: VerifyPayload = { email, otp: code };

    try {
      const data = await verifyCodeToChangePassword(payload);

      const user = {
        email,
        name: data?.name ?? email.split("@")[0],
        token: data?.token,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("otp", code);
      localStorage.setItem("reset_email", email); // ✅ برای Change Password
      localStorage.removeItem("userEmailToChangePass");

      navigate("/change-password");
    } catch (err: any) {
      setError(err.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("ایمیل کاربر مشخص نیست.");
      return;
    }

    setResendLoading(true);
    setError("");

    const payload: ResendCodePayload = { email };

    try {
      await resendCodeToChangePassword(payload);
      setResendTimer(300); // Reset timer
    } catch (err: any) {
      setError(err.message || "خطا در ارسال کد جدید");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="verify-container">
      <form className="verify-card" onSubmit={handleSubmit}>
        <img src={design_img} className="verify-image" alt="design" />

        <h3 className="verify-title">کد تأیید را وارد کنید</h3>
        <p className="verify-subtitle">
          {email
            ? `کدی که به ایمیل ${email} ارسال شده را وارد کنید`
            : "کدی که به ایمیل شما ارسال شده را وارد کنید"}
        </p>

        {error && <p className="verify-error">{error}</p>}

        <input
          className="verify-input"
          type="text"
          placeholder="کد تأیید"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button className="verify-button" disabled={loading}>
          {loading ? "در حال بررسی..." : "تأیید"}
        </button>

        <div className="resend-container">
          <span className="resend-timer">{formatTime(resendTimer)}</span>

          <button
            type="button"
            className="resend-button"
            onClick={handleResend}
            disabled={resendLoading || resendTimer > 0}
          >
            {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
          </button>
        </div>
      </form>
    </div>
  );
}

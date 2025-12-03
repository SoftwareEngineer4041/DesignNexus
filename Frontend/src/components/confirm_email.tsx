import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/confirm_email.css";
import design_img from "../assets/design_img.png";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(300); // 5 دقیقه = 300 ثانیه

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) throw new Error("Verification failed");

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to resend code");

      setResendTimer(300); // دوباره 5 دقیقه
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  // فرمت نمایش دقیقه:ثانیه
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="verify-container">
      <form className="verify-card" onSubmit={handleSubmit}>
        <img src={design_img} className="verify-image" />

        <h3 className="verify-title">کد تأیید را وارد کنید</h3>
        <p className="verify-subtitle">کدی که به ایمیل شما ارسال شده را وارد نمایید</p>

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
            ارسال مجدد
          </button>
        </div>
      </form>
    </div>
  );
}

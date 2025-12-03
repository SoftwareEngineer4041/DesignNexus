import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/confirm_email.css";
import design_img from "../assets/design_img.png";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(300); // 5 دقیقه = 300 ثانیه

  useEffect(() => {
    const stateEmail = (location.state as any)?.email;
    const storedEmail = localStorage.getItem("signupEmail");
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("signupEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("ایمیل کاربر برای تأیید یافت نشد. لطفاً مجدداً ثبت‌نام کنید.");
      // می‌تونی کاربر رو به signup هدایت کنی:
      // setTimeout(() => navigate("/signup"), 2000);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("ایمیل کاربر برای تأیید مشخص نیست.");
      setLoading(false);
      return;
    }

    const info = {
      email: email,
      otp: code
    };

    try {
      const res = await fetch("http://localhost:5209/api/Auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const serverMessage = data?.message || data?.errors || "تأیید با خطا مواجه شد";
        setError(typeof serverMessage === "string" ? serverMessage : JSON.stringify(serverMessage));
        return;
      }

      // فرض: سرور اطلاعات کاربر را در پاسخ می‌دهد (مثلاً { name, email, token })
      // اگر سرور فقط OK می‌دهد، حداقل ایمیل را ذخیره کن
      const userToStore: any = {
        email,
        name: data?.name ?? email.split("@")[0],
      };
      if (data?.token) {
        userToStore.token = data.token;
      }

      localStorage.setItem("user", JSON.stringify(userToStore));
      localStorage.removeItem("signupEmail"); // پاک کردن ایمیل ثبت‌نام موقت
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------------------------
  const handleResend = async () => {
    if (!email) {
      setError("ایمیل کاربر برای ارسال مجدد کد مشخص نیست.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      // توجه: اغلب سرورها برای resend نیاز به email دارن، نه code
      const res = await fetch("http://localhost:5209/api/Auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // قبلاً {code} بود — اصلاح شد
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const serverMessage = data?.message || "خطا در ارسال مجدد کد";
        setError(serverMessage);
        return;
      }

      setResendTimer(300); // دوباره 5 دقیقه
    } catch (err: any) {
      setError(err.message || "خطا در ارسال درخواست");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  //-----------------------------------------------------------------------------------------
  return (
    <div className="verify-container">
      <form className="verify-card" onSubmit={handleSubmit}>
        <img src={design_img} className="verify-image" alt="design" />

        <h3 className="verify-title">کد تأیید را وارد کنید</h3>
        <p className="verify-subtitle">
          {email ? `کدی که به ایمیل ${email} ارسال شده را وارد نمایید` : "کدی که به ایمیل شما ارسال شده را وارد نمایید"}
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
            {resendLoading ? "در حال ارسال..." : "ارسال مجدد"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/confirm_email.css";
import design_img from "../assets/design_img.png";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      </form>
    </div>
  );
}

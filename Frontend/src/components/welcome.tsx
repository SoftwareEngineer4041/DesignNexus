import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

interface User {
  name: string;
  email: string;
}

interface WelcomePageProps {
  user: User | null;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // یا لودینگ ساده

  return (
    <div className="welcome-container">
      <h1 className="welcome-heading">خوش آمدید، {user.name}!</h1>
      <p className="welcome-text">ایمیل شما: {user.email}</p>
      <p className="welcome-text">
        ثبت‌نام شما با موفقیت انجام شد و شما وارد سیستم شدید.
      </p>
    </div>
  );
};

export default WelcomePage;

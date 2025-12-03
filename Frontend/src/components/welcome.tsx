import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/welcome.css";

interface User {
  name: string;
  email: string;
}

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // خواندن کاربر از localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

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
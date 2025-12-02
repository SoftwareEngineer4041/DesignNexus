// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login_page";
import SignupPage from "./components/signup_page";
import PasswordResetPage from "./components/forgot_password";
import VerifyCodePage from "./components/confirm_email";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<PasswordResetPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="*" element={<LoginPage />} /> {/* صفحه پیش‌فرض */}
      </Routes>
    </Router>
  );
}

export default App;

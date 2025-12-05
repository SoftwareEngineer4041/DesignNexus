import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/login_page";
import SignupPage from "./features/auth/pages/signup_page";
import PasswordResetPage from "./features/auth/pages/reset_password";
import VerifyCodePage from "./features/auth/pages/verify_email_page";
import WelcomePage from "./features/auth/pages/welcome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<PasswordResetPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/dashboard" element={<WelcomePage />} />
        <Route path="/" element={<LoginPage />} /> {/* صفحه پیش‌فرض */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

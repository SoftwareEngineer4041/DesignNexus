import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login_page";
import SignupPage from "./components/signup_page";
import PasswordResetPage from "./components/forgot_password";
import VerifyCodePage from "./components/confirm_email";
import WelcomePage from "./components/welcome";

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

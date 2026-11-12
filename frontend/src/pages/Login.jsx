import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(nationalId.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout className="auth-layout-login">
      <div className="auth-card auth-card-login">
        <h2>تسجيل الدخول</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-national-id">الرقم القومي</label>
          <input
            id="login-national-id"
            type="text"
            value={nationalId}
            onChange={(event) => setNationalId(event.target.value)}
            placeholder="أدخل الرقم القومي"
            autoComplete="username"
            required
          />

          <label htmlFor="login-password">كلمة المرور</label>
          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              required
            />
            <button type="button" className="password-visibility-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
          </div>

          <div style={{ textAlign: "left", margin: "10px 0" }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/forgot-password")}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p>ليس لديك حساب؟</p>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/register")}
        >
          إنشاء حساب
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;

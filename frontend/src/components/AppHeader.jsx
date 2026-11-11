import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthorityBrand from "./AuthorityBrand";

const AppHeader = () => {
  const { user, logout, login } = useAuth();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showAuthenticatedHeader = Boolean(user) && location.pathname !== "/login";
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(nationalId.trim(), password);
      setNationalId("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err.response?.data?.message || "الرقم القومي أو كلمة المرور غير صحيحة.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="portal-app-header">
      <Link to={user ? "/dashboard" : "/login"} className="portal-brand-link">
        <AuthorityBrand compact />
      </Link>

      {showAuthenticatedHeader ? (
        <>
          <nav className="portal-nav" aria-label="التنقل الرئيسي">
            <NavLink to="/dashboard">الرئيسية</NavLink>
            <NavLink to="/services">الخدمات</NavLink>
            <NavLink to="/applications">طلباتي</NavLink>
            {["admin", "reviewer"].includes(user.role) && (
              <NavLink to="/admin" end>مراجعة الطلبات</NavLink>
            )}
            {user.role === "admin" && (
              <NavLink to="/admin/users">إدارة المستخدمين</NavLink>
            )}
          </nav>
          <div className="portal-user-actions">
            <span className="portal-user-name">{user.name}</span>
            <Link to="/account-settings" className="portal-icon-link">
              إعدادات الحساب
            </Link>
            <button type="button" onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </div>
        </>
      ) : (
        <div className="portal-auth-area">
          <form className="portal-inline-login" onSubmit={handleLogin}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="username"
              aria-label="الرقم القومي"
              placeholder="الرقم القومي"
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              required
            />
            <input
              type="password"
              autoComplete="current-password"
              aria-label="كلمة المرور"
              placeholder="كلمة المرور"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
          <div className="portal-auth-links">
            <NavLink to="/register" className="portal-register-link">إنشاء حساب جديد</NavLink>
            <NavLink to="/forgot-password" className="portal-forgot-link">نسيت كلمة المرور؟</NavLink>
          </div>
          {loginError && <p className="portal-login-error" role="alert">{loginError}</p>}
        </div>
      )}
    </header>
  );
};

export default AppHeader;

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthorityBrand from "./AuthorityBrand";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="portal-app-header">
      <Link to={user ? "/dashboard" : "/login"} className="portal-brand-link">
        <AuthorityBrand compact />
      </Link>

      {user ? (
        <>
          <nav className="portal-nav" aria-label="التنقل الرئيسي">
            <NavLink to="/dashboard">الرئيسية</NavLink>
            <NavLink to="/services">الخدمات</NavLink>
            <NavLink to="/applications">طلباتي</NavLink>
            {["admin", "reviewer"].includes(user.role) && (
              <NavLink to="/admin">مراجعة الطلبات</NavLink>
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
        <nav className="portal-auth-nav" aria-label="حساب المستخدم">
          <NavLink to="/login">تسجيل الدخول</NavLink>
          <NavLink to="/register" className="portal-register-link">
            إنشاء حساب
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default AppHeader;

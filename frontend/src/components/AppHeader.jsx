import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthorityBrand from "./AuthorityBrand";
import api from "../services/api";

const AppHeader = () => {
  const { user, logout, login } = useAuth();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portal-theme") || "light";
    } catch {
      return "light";
    }
  });
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticationPage = ["/login", "/sign-in", "/register", "/forgot-password"].includes(location.pathname);
  const showAuthenticatedHeader = Boolean(user) && !isAuthenticationPage;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("portal-theme", theme);
    } catch {
      // The selected theme still applies for the current session.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (!showAuthenticatedHeader) return undefined;

    const loadNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Load notifications error:", error);
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 10000);
    return () => window.clearInterval(intervalId);
  }, [user?._id, showAuthenticatedHeader]);

  const markNotificationRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

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
            <button
              type="button"
              className="portal-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
              title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
            >
              <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
              <span className="portal-theme-toggle-label">{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>
            </button>
            <div className="portal-notifications">
              <button
                type="button"
                className="portal-notification-bell"
                aria-label={`الإشعارات، غير المقروء: ${unreadCount}`}
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <span aria-hidden="true">🔔</span>
                {unreadCount > 0 && (
                  <span className="portal-notification-count">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="portal-notification-panel" dir="rtl">
                  <div className="portal-notification-heading">
                    <strong>الإشعارات</strong>
                    {unreadCount > 0 && (
                      <button type="button" onClick={markAllNotificationsRead}>
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="portal-notification-empty">لا توجد إشعارات حتى الآن</p>
                  ) : (
                    <div className="portal-notification-list">
                      {notifications.map((notification) => (
                        <Link
                          key={notification._id}
                          to={notification.applicationId?._id
                            ? `/applications/${notification.applicationId._id}`
                            : "/applications"}
                          className={`portal-notification-item ${notification.isRead ? "is-read" : "is-unread"}`}
                          onClick={() => {
                            if (!notification.isRead) markNotificationRead(notification._id);
                            setNotificationsOpen(false);
                          }}
                        >
                          <span className="portal-notification-title">{notification.title}</span>
                          <span className="portal-notification-message">{notification.message}</span>
                          <span className="portal-notification-date">
                            {new Date(notification.createdAt).toLocaleString("ar-EG")}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="portal-user-name">{user.name}</span>
            <Link to="/account-settings" className="portal-icon-link">
              إعدادات الحساب
            </Link>
            <button
              type="button"
              className="portal-logout-button"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </button>
          </div>
        </>
      ) : (
        <div className="portal-auth-area">
          <button
            type="button"
            className="portal-theme-toggle portal-theme-toggle-public"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="portal-theme-toggle-label">{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>
          </button>
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

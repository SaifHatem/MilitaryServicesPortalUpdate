import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    serviceStatus: "",
    password: "",
    confirmPassword: "",
    recoveryPhrase: "",
    confirmRecoveryPhrase: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!["active", "retired"].includes(form.serviceStatus)) {
      setError("يرجى تحديد حالة الضابط: بالخدمة أو بالمعاش.");
      return;
    }

    if (!/^\d{14}$/.test(form.nationalId.trim())) {
      setError("الرقم القومي يجب أن يتكون من 14 رقمًا.");
      return;
    }

    if (form.password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (form.recoveryPhrase.trim().length < 12) {
      setError("العبارة السرية يجب ألا تقل عن 12 حرفًا.");
      return;
    }

    if (
      form.recoveryPhrase.trim().toLowerCase() !==
      form.confirmRecoveryPhrase.trim().toLowerCase()
    ) {
      setError("تأكيد العبارة السرية غير مطابق.");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registrationData } = form;
      await api.post("/auth/register", {
        ...registrationData,
        name: form.name.trim(),
        nationalId: form.nationalId.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        recoveryPhrase: form.recoveryPhrase.trim(),
        confirmRecoveryPhrase: form.confirmRecoveryPhrase.trim(),
      });

      setSuccess("تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout className="auth-layout-register">
      <div className="auth-card auth-card-register">
        <h2>إنشاء حساب</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">الاسم بالكامل</label>
          <input
            id="register-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="أدخل الاسم بالكامل"
            autoComplete="name"
            required
          />

          <label htmlFor="register-national-id">الرقم القومي</label>
          <input
            id="register-national-id"
            name="nationalId"
            value={form.nationalId}
            onChange={handleChange}
            placeholder="14 رقمًا"
            inputMode="numeric"
            maxLength={14}
            required
          />

          <label htmlFor="register-phone">رقم الهاتف</label>
          <input
            id="register-phone"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="أدخل رقم الهاتف"
            autoComplete="tel"
            required
          />

          <div className="service-status-group">
            <label className="service-status-label">حالة الضابط</label>
            <fieldset className="service-status-fieldset">
              <p>حدد الحالة الحالية حتى تظهر الخدمات المناسبة لحسابك.</p>
            <div className="service-status-options">
              <label className={`service-status-option ${form.serviceStatus === "active" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="serviceStatus"
                  value="active"
                  checked={form.serviceStatus === "active"}
                  onChange={handleChange}
                />
                <span className="service-status-option-icon">✦</span>
                <span>
                  <strong>بالخدمة</strong>
                  <small>ضابط بالخدمة حاليًا</small>
                </span>
              </label>
              <label className={`service-status-option ${form.serviceStatus === "retired" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="serviceStatus"
                  value="retired"
                  checked={form.serviceStatus === "retired"}
                  onChange={handleChange}
                />
                <span className="service-status-option-icon">◈</span>
                <span>
                  <strong>بالمعاش</strong>
                  <small>ضابط بالمعاش</small>
                </span>
              </label>
            </div>
            </fieldset>
          </div>

          <label htmlFor="register-email">البريد الإلكتروني (اختياري)</label>
          <input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            autoComplete="email"
          />

          <label htmlFor="register-password">كلمة المرور</label>
          <div className="password-input-wrapper">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8 أحرف على الأقل"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              className="password-visibility-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>
              )}
            </button>
          </div>

          <label htmlFor="register-confirm-password">تأكيد كلمة المرور</label>
          <div className="password-input-wrapper">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="أعد كتابة كلمة المرور"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              className="password-visibility-toggle"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
              title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showConfirmPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>
              )}
            </button>
          </div>

          <hr />

          <h3>عبارة استعادة الحساب</h3>
          <p>
            احفظ العبارة السرية في مكان آمن. ستحتاج إليها إذا نسيت كلمة المرور.
          </p>

          <label htmlFor="recovery-phrase">العبارة السرية</label>
          <input
            id="recovery-phrase"
            type="text"
            name="recoveryPhrase"
            value={form.recoveryPhrase}
            onChange={handleChange}
            placeholder="12 حرفًا على الأقل"
            autoComplete="off"
            minLength={12}
            maxLength={200}
            required
          />

          <label htmlFor="confirm-recovery-phrase">تأكيد العبارة السرية</label>
          <input
            id="confirm-recovery-phrase"
            type="text"
            name="confirmRecoveryPhrase"
            value={form.confirmRecoveryPhrase}
            onChange={handleChange}
            placeholder="أعد كتابة العبارة السرية"
            autoComplete="off"
            minLength={12}
            maxLength={200}
            required
          />

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="success" role="status">
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/login")}
        >
          العودة لتسجيل الدخول
        </button>
      </div>
    </AuthLayout>
  );
};

export default Register;

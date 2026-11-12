import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [nationalId, setNationalId] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{14}$/.test(nationalId.trim())) {
      setError("الرقم القومي يجب أن يتكون من 14 رقمًا.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password/verify", {
        nationalId: nationalId.trim(),
        recoveryPhrase: recoveryPhrase.trim(),
      });

      setResetToken(response.data.resetToken);
      setMessage(response.data.message || "تم التحقق بنجاح.");
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "تعذر التحقق من البيانات. حاول مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password/reset", {
        resetToken,
        newPassword,
        confirmPassword,
      });

      setMessage(response.data.message || "تم تغيير كلمة المرور بنجاح.");
      setResetToken("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "تعذر تغيير كلمة المرور. ابدأ عملية الاستعادة من جديد.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout className="auth-layout-forgotpassword">
      <div className="auth-card auth-card-forgotpassword">
        <h2>استعادة كلمة المرور</h2>

        {step === 1 ? (
          <form onSubmit={handleVerify}>
            <p>
              أدخل الرقم القومي والجملة السرية التي سجلتها عند إنشاء الحساب.
            </p>

            <label htmlFor="recovery-national-id">الرقم القومي</label>
            <input
              id="recovery-national-id"
              type="text"
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              placeholder="14 رقمًا"
              inputMode="numeric"
              maxLength={14}
              required
            />

            <label htmlFor="recovery-phrase">الجملة السرية</label>
            <input
              id="recovery-phrase"
              type="text"
              value={recoveryPhrase}
              onChange={(event) => setRecoveryPhrase(event.target.value)}
              placeholder="أدخل الجملة السرية"
              autoComplete="off"
              required
            />

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="success" role="status">
                {message}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "جارٍ التحقق..." : "التحقق والمتابعة"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <p>
              تم التحقق من الجملة السرية. أدخل كلمة المرور الجديدة. رمز
              الاستعادة صالح لمدة 5 دقائق.
            </p>

            <label htmlFor="new-password">كلمة المرور الجديدة</label>
            <div className="password-input-wrapper">
<input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
<button type="button" className="password-visibility-toggle" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showNewPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
            </div>

            <label htmlFor="confirm-new-password">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="password-input-wrapper">
<input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
<button type="button" className="password-visibility-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showConfirmPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="success" role="status">
                {message}
              </div>
            )}

            <button type="submit" disabled={loading || !resetToken}>
              {loading ? "جارٍ تغيير كلمة المرور..." : "تغيير كلمة المرور"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setStep(1);
                setResetToken("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setMessage("");
              }}
            >
              العودة للتحقق
            </button>
          </form>
        )}

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

export default ForgotPassword;

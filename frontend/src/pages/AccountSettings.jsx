import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoveryCurrentPassword, setShowRecoveryCurrentPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [recoveryCurrentPassword, setRecoveryCurrentPassword] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [confirmRecoveryPhrase, setConfirmRecoveryPhrase] = useState("");
  const [savingRecovery, setSavingRecovery] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryError, setRecoveryError] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      setName(user?.name || "");
      setPhoneNumber(user?.phoneNumber || "");
      setEmail(user?.email || "");
    });
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim() || !phoneNumber.trim()) {
      setError("الاسم ورقم الهاتف مطلوبان.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateUser({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
      });

      setMessage(response.message || "تم تحديث بيانات الحساب بنجاح.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordMessage(
        response.data.message || "تم تغيير كلمة المرور بنجاح.",
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveRecoveryPhrase = async (event) => {
    event.preventDefault();
    setRecoveryMessage("");
    setRecoveryError("");

    if (recoveryPhrase.trim().length < 12) {
      setRecoveryError("الجملة السرية يجب ألا تقل عن 12 حرفًا.");
      return;
    }

    if (
      recoveryPhrase.trim().toLowerCase() !==
      confirmRecoveryPhrase.trim().toLowerCase()
    ) {
      setRecoveryError("تأكيد الجملة السرية غير مطابق.");
      return;
    }

    try {
      setSavingRecovery(true);

      const response = await api.patch("/auth/recovery-phrase", {
        currentPassword: recoveryCurrentPassword,
        recoveryPhrase: recoveryPhrase.trim(),
        confirmRecoveryPhrase: confirmRecoveryPhrase.trim(),
      });

      setRecoveryMessage(
        response.data.message || "تم حفظ الجملة السرية بنجاح.",
      );
      setRecoveryCurrentPassword("");
      setRecoveryPhrase("");
      setConfirmRecoveryPhrase("");
    } catch (err) {
      setRecoveryError(
        err.response?.data?.message || "حدث خطأ أثناء حفظ الجملة السرية.",
      );
    } finally {
      setSavingRecovery(false);
    }
  };



  if (!user) {
    return (
      <div className="dashboard">
        <p>جارٍ تحميل بيانات الحساب...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <h1>إعدادات الحساب</h1>
        <p>يمكنك تعديل بياناتك الشخصية وإدارة كلمة المرور والجملة السرية.</p>

        <form onSubmit={handleSubmit} className="account-settings-form">
          <div className="form-group">
            <label htmlFor="account-name">الاسم بالكامل</label>
            <input
              id="account-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="account-national-id">الرقم القومي</label>
            <input
              id="account-national-id"
              value={user.nationalId || ""}
              readOnly
            />
            <small>لا يمكن تعديل الرقم القومي من هذه الصفحة.</small>
          </div>

          <div className="form-group">
            <label htmlFor="account-phone">رقم الهاتف</label>
            <input
              id="account-phone"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="account-email">البريد الإلكتروني</label>
            <input
              id="account-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <small>يمكنك ترك البريد الإلكتروني فارغًا.</small>
          </div>

          {message && (
            <p role="status" style={{ color: "green" }}>
              {message}
            </p>
          )}
          {error && (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>

          <button type="button" onClick={() => navigate("/dashboard")}>
            إلغاء والعودة
          </button>
        </form>

        <section className="password-settings-section">
          <h2>تغيير كلمة المرور</h2>
          <p>أدخل كلمة المرور الحالية ثم كلمة المرور الجديدة.</p>

          <form
            onSubmit={handleChangePassword}
            className="account-settings-form"
          >
            <div className="form-group">
              <label htmlFor="current-password">كلمة المرور الحالية</label>
              <div className="password-input-wrapper">
<input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
<button type="button" className="password-visibility-toggle" onClick={() => setShowCurrentPassword((visible) => !visible)} aria-label={showCurrentPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showCurrentPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showCurrentPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-password">كلمة المرور الجديدة</label>
              <div className="password-input-wrapper">
<input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
<button type="button" className="password-visibility-toggle" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showNewPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="password-input-wrapper">
<input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
<button type="button" className="password-visibility-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showConfirmPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
              </div>
            </div>

            {passwordMessage && (
              <p role="status" style={{ color: "green" }}>
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p role="alert" style={{ color: "red" }}>
                {passwordError}
              </p>
            )}

            <button type="submit" disabled={changingPassword}>
              {changingPassword
                ? "جارٍ تغيير كلمة المرور..."
                : "تغيير كلمة المرور"}
            </button>
          </form>
        </section>

        <section className="password-settings-section">
          <h2>الجملة السرية لاستعادة الحساب</h2>
          <p>
            عيّن جملة سرية واحفظها في مكان آمن. ستحتاج إليها لاستعادة حسابك إذا
            نسيت كلمة المرور. يجب ألا تقل عن 12 حرفًا.
          </p>

          <form
            onSubmit={handleSaveRecoveryPhrase}
            className="account-settings-form"
          >
            <div className="form-group">
              <label htmlFor="recovery-current-password">
                كلمة المرور الحالية للتأكيد
              </label>
              <div className="password-input-wrapper">
<input
                id="recovery-current-password"
                type={showRecoveryCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                value={recoveryCurrentPassword}
                onChange={(event) =>
                  setRecoveryCurrentPassword(event.target.value)
                }
                required
              />
<button type="button" className="password-visibility-toggle" onClick={() => setShowRecoveryCurrentPassword((visible) => !visible)} aria-label={showRecoveryCurrentPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} title={showRecoveryCurrentPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showRecoveryCurrentPassword ? (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.5 1.2 1.4 2.5 2.8 3.6A10.7 10.7 0 0012 17c.8 0 1.6-.1 2.3-.3" /></svg>) : (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>)}</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="account-recovery-phrase">
                الجملة السرية الجديدة
              </label>
              <input
                id="account-recovery-phrase"
                type="text"
                autoComplete="off"
                minLength={12}
                maxLength={200}
                value={recoveryPhrase}
                onChange={(event) => setRecoveryPhrase(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="account-confirm-recovery-phrase">
                تأكيد الجملة السرية
              </label>
              <input
                id="account-confirm-recovery-phrase"
                type="text"
                autoComplete="off"
                minLength={12}
                maxLength={200}
                value={confirmRecoveryPhrase}
                onChange={(event) =>
                  setConfirmRecoveryPhrase(event.target.value)
                }
                required
              />
            </div>

            {recoveryMessage && (
              <p role="status" style={{ color: "green" }}>
                {recoveryMessage}
              </p>
            )}
            {recoveryError && (
              <p role="alert" style={{ color: "red" }}>
                {recoveryError}
              </p>
            )}

            <button type="submit" disabled={savingRecovery}>
              {savingRecovery ? "جارٍ حفظ الجملة..." : "حفظ الجملة السرية"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AccountSettings;

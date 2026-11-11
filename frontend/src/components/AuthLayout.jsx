const AuthLayout = ({ children, className = "" }) => (
  <section className={`auth-page ${className}`}>
    <video
      className="auth-background-video"
      src="/videos/auth-background.mp4"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
    <div className="auth-background-overlay" />
    {children}
  </section>
);

export default AuthLayout;

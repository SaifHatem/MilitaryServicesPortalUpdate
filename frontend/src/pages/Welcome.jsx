const Welcome = () => (
  <section className="auth-page auth-layout-login public-video-page">
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
    <div className="public-video-footer">
      منظومة الخدمات المقدمة للسادة ضباط هيئة الإستخبارات العسكرية
      <span>فرع شئون ضباط الهيئة</span>
    </div>
  </section>
);

export default Welcome;

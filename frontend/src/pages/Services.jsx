import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب الخدمات");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) return <div className="loading">جاري تحميل الخدمات...</div>;

  return (
    <section className="services-page services-page-modern">
      <div className="services-page-heading">
        <div>
          <span className="page-eyebrow">الخدمات المتاحة</span>
          <h1>الخدمات الإلكترونية</h1>
          <p>اختر الخدمة المطلوبة للاطلاع على المستندات وبدء تقديم الطلب.</p>
        </div>
        <button type="button" className="services-back-button" onClick={() => navigate("/dashboard")}>
          العودة للرئيسية
        </button>
      </div>

      {error && <div className="error" role="alert">{error}</div>}

      {!error && services.length === 0 && (
        <div className="services-empty-state">
          <span>▦</span>
          <h2>لا توجد خدمات متاحة</h2>
          <p>لا توجد خدمات مرتبطة بحالة الحساب الحالية.</p>
        </div>
      )}

      <div className="services-grid services-grid-modern">
        {services.map((service, index) => (
          <article
            className="service-card service-card-modern"
            key={service._id}
            style={{ "--service-color": service.themeColor || "#527C78" }}
          >
            <div className="service-card-topline">
              <span className="service-card-icon">{String(index + 1).padStart(2, "0")}</span>
              <span className="service-card-status">متاحة للتقديم</span>
            </div>
            <h2>{service.name}</h2>
            <p>{service.description || "يمكنك الاطلاع على متطلبات الخدمة ورفع المستندات المطلوبة إلكترونيًا."}</p>
            <button type="button" onClick={() => navigate(`/services/${service._id}`)}>
              عرض المتطلبات <span aria-hidden="true">←</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <span className="dashboard-eyebrow">بوابة الخدمات الإلكترونية</span>
        <h1>الخدمات الإلكترونية</h1>
        <p>اختر الخدمة التي ترغب في تقديم طلب لها أو تابع طلباتك الحالية.</p>

        <div className="dashboard-cards">
          <button
            type="button"
            className="dashboard-card"
            onClick={() => navigate("/services")}
          >
            <span className="dashboard-card-icon">▦</span>
            <h2>الخدمات</h2>
            <p>استعرض الخدمات المتاحة لحسابك وابدأ تقديم طلب جديد.</p>
            <span className="dashboard-card-action">عرض الخدمات ←</span>
          </button>

          <button
            type="button"
            className="dashboard-card"
            onClick={() => navigate("/applications")}
          >
            <span className="dashboard-card-icon">▤</span>
            <h2>طلباتي</h2>
            <p>تابع حالة الطلبات والملاحظات والمستندات المطلوبة.</p>
            <span className="dashboard-card-action">عرض طلباتي ←</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

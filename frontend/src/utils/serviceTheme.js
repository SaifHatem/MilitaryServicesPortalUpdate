// One unique pastel identity per service. Keep these names in sync with backend/seed.js.
const SERVICE_THEMES = {
  "البطاقات العلاجية": { bg: "#F0F5FF", border: "#D5E3FA", color: "#285BB5" },
  "الحج والعمرة لأسر الشهداء": { bg: "#FFF8E7", border: "#F2E4BC", color: "#A87516" },
  "التماس العلاج": { bg: "#FFF2E9", border: "#F4D9C7", color: "#B85D28" },
  "الحج والعمرة": { bg: "#EFF9F2", border: "#D2EBDD", color: "#28764A" },
  "ترخيص السلاح": { bg: "#F6F0FF", border: "#E3D7F5", color: "#7045A8" },
  "كارنيهات النوادي": { bg: "#EFF9FA", border: "#D2E9EC", color: "#267681" },
  "كارنيهات جمعية المحاربين القدامى": { bg: "#FFF1F5", border: "#F1D6DF", color: "#A94768" },
  "طلب اصطحاب أسرة بالخارج": { bg: "#F2F3FF", border: "#DDE0F7", color: "#555DB0" },
  "تكريم المتفوقين دراسيًا من أسر الضباط": { bg: "#FBF5EC", border: "#EFE0CB", color: "#946331" },
  "إضافة الصور الشخصية والعائلية": { bg: "#F4F8EC", border: "#E1EACF", color: "#607D36" },
  "إضافة نموذج 121 مميكن": { bg: "#F0F7FC", border: "#D7E9F4", color: "#39799E" },
};

const FALLBACK_THEME = {
  bg: "#F0F5FF",
  border: "#D5E3FA",
  color: "#285BB5",
};

export const getServiceTheme = (service) => {
  const name = typeof service === "string" ? service : service?.name;
  return SERVICE_THEMES[name] || FALLBACK_THEME;
};

export const getServiceThemeStyle = (service) => {
  const theme = getServiceTheme(service);
  return {
    "--service-color": theme.color,
    "--service-bg": theme.bg,
    "--service-border": theme.border,
    "--card-bg": theme.bg,
    "--card-border": theme.border,
    "--card-accent": theme.color,
  };
};

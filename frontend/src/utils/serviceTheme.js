// One unique pastel identity per service. Keep these names in sync with backend/seed.js.
const SERVICE_THEMES = {
  "البطاقات العلاجية": { bg: "#E3EEFF", border: "#B9D2FF", color: "#285BB5" },
  "الحج والعمرة لأسر الشهداء": { bg: "#FFF0C9", border: "#F4D98E", color: "#A87516" },
  "التماس العلاج": { bg: "#FFE4D2", border: "#F6C4A2", color: "#B85D28" },
  "الحج والعمرة": { bg: "#DDF3E7", border: "#B5DFC5", color: "#28764A" },
  "ترخيص السلاح": { bg: "#EDE2FF", border: "#D2BDF5", color: "#7045A8" },
  "كارنيهات النوادي": { bg: "#DDF2F4", border: "#B4DDE1", color: "#267681" },
  "كارنيهات جمعية المحاربين القدامى": { bg: "#FBE0E8", border: "#EFBCCB", color: "#A94768" },
  "طلب اصطحاب أسرة بالخارج": { bg: "#E7E9FF", border: "#C8CCF5", color: "#555DB0" },
  "تكريم المتفوقين دراسيًا من أسر الضباط": { bg: "#F5E7D5", border: "#E6CBA9", color: "#946331" },
  "إضافة الصور الشخصية والعائلية": { bg: "#E8F1D9", border: "#CADDAF", color: "#607D36" },
  "إضافة نموذج 121 مميكن": { bg: "#DCEEF9", border: "#B6D9ED", color: "#39799E" },
};

const FALLBACK_THEME = {
  bg: "#E3EEFF",
  border: "#B9D2FF",
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

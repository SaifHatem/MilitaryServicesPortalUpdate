// One unique pastel identity per service. Keep these names in sync with backend/seed.js.
const SERVICE_THEMES = {
  "البطاقات العلاجية": { bg: "#DCEBFF", border: "#AFCBFF", color: "#285BB5" },
  "الحج والعمرة لأسر الشهداء": { bg: "#FFEDB5", border: "#F2D27A", color: "#A87516" },
  "التماس العلاج": { bg: "#FFDECA", border: "#F2B992", color: "#B85D28" },
  "الحج والعمرة": { bg: "#D5F1DF", border: "#A8DAB9", color: "#28764A" },
  "ترخيص السلاح": { bg: "#E9DCFF", border: "#CBB0F0", color: "#7045A8" },
  "كارنيهات النوادي": { bg: "#D2F0F3", border: "#A5D9DE", color: "#267681" },
  "كارنيهات جمعية المحاربين القدامى": { bg: "#F9DCE6", border: "#E9AFC1", color: "#A94768" },
  "طلب اصطحاب أسرة بالخارج": { bg: "#E1E5FF", border: "#BFC6F3", color: "#555DB0" },
  "تكريم المتفوقين دراسيًا من أسر الضباط": { bg: "#F4E2C9", border: "#E1C096", color: "#946331" },
  "إضافة الصور الشخصية والعائلية": { bg: "#E4F0D0", border: "#C5DCA3", color: "#607D36" },
  "إضافة نموذج 121 مميكن": { bg: "#D8EDFA", border: "#A9D4ED", color: "#39799E" },
};

const FALLBACK_THEME = {
  bg: "#DCEBFF",
  border: "#AFCBFF",
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

const SERVICE_THEMES = {
  "البطاقات العلاجية": { bg: "#E8F1FF", border: "#C9DDFF", color: "#2862C7" },
  "الحج والعمرة لأسر الشهداء": { bg: "#FFF1D2", border: "#FFDEA0", color: "#A96516" },
  "التماس العلاج": { bg: "#FFE9D8", border: "#FFD0AA", color: "#B96522" },
  "الحج والعمرة": { bg: "#E5F6ED", border: "#BCE8CF", color: "#238354" },
  "ترخيص السلاح": { bg: "#F4EAFF", border: "#DFC8FF", color: "#7845B5" },
  "كارنيهات النوادي": { bg: "#E2F5F6", border: "#B9E4E7", color: "#287F86" },
  "كارنيهات جمعية المحاربين القدامى": { bg: "#FFE9E5", border: "#FFC9BD", color: "#C35C49" },
  "طلب اصطحاب أسرة بالخارج": { bg: "#EAF0FF", border: "#CFD9FF", color: "#536BC2" },
  "تكريم المتفوقين دراسيًا من أسر الضباط": { bg: "#FCEAF3", border: "#F4C9DE", color: "#B34E82" },
  "إضافة الصور الشخصية والعائلية": { bg: "#EAF5E5", border: "#CDE5C4", color: "#548348" },
  "إضافة نموذج 121 مميكن": { bg: "#FFF0E8", border: "#FFD4C1", color: "#BD6945" },
};

const FALLBACK_THEME = {
  bg: "#E8F1FF",
  border: "#C9DDFF",
  color: "#2862C7",
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
  };
};

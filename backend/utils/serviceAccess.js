const RETIRED_ONLY_SERVICES = new Set([
  "الحج والعمرة لأسر الشهداء",
  "كارنيهات جمعية المحاربين القدامى",
]);

const RETIRED_ALLOWED_SERVICES = new Set([
  "البطاقات العلاجية",
  "الحج والعمرة لأسر الشهداء",
  "كارنيهات جمعية المحاربين القدامى",
  "التماس العلاج",
  "كارنيهات النوادي",
]);

const canAccessService = (user, service) => {
  if (!user || !service) return false;
  if (["admin", "reviewer"].includes(user.role)) return true;

  if (user.serviceStatus === "retired") {
    return RETIRED_ALLOWED_SERVICES.has(service.name);
  }

  return !RETIRED_ONLY_SERVICES.has(service.name);
};

module.exports = { canAccessService };

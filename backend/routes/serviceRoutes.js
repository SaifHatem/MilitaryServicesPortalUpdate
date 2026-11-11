const express = require("express");
const Service = require("../models/Service");
const authenticate = require("../middleware/authMiddleware");
const { canAccessService } = require("../utils/serviceAccess");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json(services.filter((service) => canAccessService(req.user, service)));
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الخدمات" });
  }
});

module.exports = router;

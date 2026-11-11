const express = require("express");
const Notification = require("../models/Notification");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

// Notifications for the signed-in user only.
router.get("/", async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user.userId })
        .populate("applicationId", "applicantName status")
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),
      Notification.countDocuments({
        recipient: req.user.userId,
        isRead: false,
      }),
    ]);

    return res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "تعذر تحميل الإشعارات" });
  }
});

// Mark one notification as read, scoped to its recipient.
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "الإشعار غير موجود" });
    }

    return res.json({ message: "تم تحديد الإشعار كمقروء" });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "تعذر تحديث الإشعار" });
  }
});

// Mark all notifications belonging to the signed-in user as read.
router.patch("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, isRead: false },
      { isRead: true },
    );

    return res.json({ message: "تم تحديد جميع الإشعارات كمقروءة" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "تعذر تحديث الإشعارات" });
  }
});

module.exports = router;

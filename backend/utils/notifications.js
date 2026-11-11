const User = require("../models/User");
const Notification = require("../models/Notification");

const notifyReviewers = async ({ application, type, title, message }) => {
  try {
    const reviewers = await User.find({
      role: { $in: ["reviewer", "admin"] },
      isActive: { $ne: false },
    }).select("_id");

    if (!reviewers.length) return;

    await Notification.insertMany(
      reviewers.map((reviewer) => ({
        recipient: reviewer._id,
        applicationId: application._id,
        type,
        title,
        message,
      })),
    );
  } catch (error) {
    // Notification failure must not undo a successfully saved application action.
    console.error("Create reviewer notifications error:", error);
  }
};

const notifyApplicant = async ({ application, type, title, message }) => {
  try {
    await Notification.create({
      recipient: application.userId,
      applicationId: application._id,
      type,
      title,
      message,
    });
  } catch (error) {
    console.error("Create applicant notification error:", error);
  }
};

module.exports = { notifyReviewers, notifyApplicant };

require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const Application = require("./models/Application");
const ApplicationFile = require("./models/ApplicationFile");

const run = async () => {
  if (process.env.CONFIRM_DELETE_TEST_USERS !== "YES") {
    console.error(
      "Safety stop: set CONFIRM_DELETE_TEST_USERS=YES to delete officer test accounts.",
    );
    process.exitCode = 1;
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Keep admin and reviewer accounts. Only ordinary officer accounts are reset.
  const users = await User.find({ role: "user" }).select("_id").lean();
  const userIds = users.map((user) => user._id);

  if (userIds.length === 0) {
    console.log("No officer accounts were found. Nothing to delete.");
    return;
  }

  const applications = await Application.find({ userId: { $in: userIds } })
    .select("_id")
    .lean();
  const applicationIds = applications.map((application) => application._id);

  const files = applicationIds.length
    ? await ApplicationFile.find({ applicationId: { $in: applicationIds } })
        .select("filePath")
        .lean()
    : [];

  if (applicationIds.length) {
    await ApplicationFile.deleteMany({ applicationId: { $in: applicationIds } });
    await Application.deleteMany({ userId: { $in: userIds } });
  }

  const uploadsRoot = path.resolve(__dirname, "uploads");
  for (const file of files) {
    if (!file.filePath) continue;
    const resolvedPath = path.resolve(
      path.isAbsolute(file.filePath) ? file.filePath : path.join(__dirname, file.filePath),
    );
    if (!resolvedPath.startsWith(`${uploadsRoot}${path.sep}`)) continue;
    try {
      await fs.promises.unlink(resolvedPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.warn(`Could not remove upload ${resolvedPath}: ${error.message}`);
      }
    }
  }

  const result = await User.deleteMany({ _id: { $in: userIds }, role: "user" });
  console.log(`Removed ${result.deletedCount} officer accounts and their applications.`);
  console.log("Admin and reviewer accounts were preserved.");
};

run()
  .catch((error) => {
    console.error("Account reset failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

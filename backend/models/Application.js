const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    textResponses: [
      {
        requirementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceRequirement",
          required: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // Reviewers can hide an application from their own queue without
    // deleting it or affecting the applicant's view.
    hiddenFromReviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "needs_correction",
      ],
      default: "draft",
    },

    notes: {
      type: String,
      default: "",
    },

    corrections: [
      {
        requirementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceRequirement",
          required: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        status: {
          type: String,
          enum: ["pending", "resolved"],
          default: "pending",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        resolvedAt: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;

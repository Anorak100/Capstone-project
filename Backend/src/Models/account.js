const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true
    },

    accountType: {
      type: String,
      enum: ["savings", "current"],
      default: "savings"
    },

    balance: {
      type: Number,
      default: 0,
      min: 0
    },

    currency: {
      type: String,
      default: "NGN"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

accountSchema.index({ userId: 1 });

module.exports = mongoose.model("Account", accountSchema);
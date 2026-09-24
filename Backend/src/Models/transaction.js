const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true
    },

    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null
    },

    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null
    },

    status: {
      type: String,
      enum: ["successful", "failed", "pending"],
      default: "successful"
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ fromAccount: 1 });
transactionSchema.index({ toAccount: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
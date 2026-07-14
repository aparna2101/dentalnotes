import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Who made the payment
    },

    orderId: {
      type: String,
      required: true, // Your internal order reference
    },

    merchantTransactionId: {
      type: String,
      required: true, // ID sent to PhonePe
    },

    amount: {
      type: Number,
      required: true, // Payment amount
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    paymentMode: {
      type: String, // e.g., "UPI", "CARD", "WALLET"
    },

    transactionId: {
      type: String, // Returned by PhonePe after success
    },

    message: {
      type: String, // Message from PhonePe like "Success" or "Failed"
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);

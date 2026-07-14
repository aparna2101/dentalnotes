const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Dental Node SP" },
  logo: { type: Object },
  contactEmail: { type: String },
  subscription: {
    planName: { type: String },
    price: { type: Number },
    durationInDays: { type: Number },
    features: [{ type: String }],
    promoVideoUrl: { type: String },
    descriptionPoints: [{ type: String }],
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settings", settingsSchema);

const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  timestamp: Date,
  ip: String,
  deviceType: String,
  referrer: String,
  fingerprint: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expiryDate: Date,
  tags: [String],
  visits: [visitSchema],
});

module.exports = mongoose.model("Url", urlSchema);

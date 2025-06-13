const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const { nanoid } = require("nanoid");
const getDeviceType = require("../utils/deviceType");
const crypto = require("crypto");

// POST /shorten
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl, customCode, tags, expiryDate } = req.body;
    const shortCode = customCode || nanoid(6);

    if (customCode && (await Url.findOne({ shortCode: customCode }))) {
      return res.status(409).json({ message: "Custom code already in use" });
    }

    const url = new Url({ originalUrl, shortCode, tags, expiryDate });
    await url.save();
    res.status(200).json({
      shortUrl: `${req.protocol}://${req.get("host")}/api/short/${shortCode}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to shorten URL" });
  }
});

// GET /urls
router.get("/urls", async (req, res) => {
  try {
    const urls = await Url.find();
    const data = urls.map((u) => ({
      originalUrl: u.originalUrl,
      shortUrl: `${req.protocol}://${req.get("host")}/api/short/${u.shortCode}`,
      shortCode: u.shortCode,
      tags: u.tags || [],
    expiryDate: u.expiryDate
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load URLs" });
  }
});

// GET /short/:code
router.get("/short/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });
  if (!url) return res.sendStatus(404);
  if (url.expiryDate && new Date() > new Date(url.expiryDate))
    return res.sendStatus(410);

  const deviceType = getDeviceType(req.headers["user-agent"]);
  const ip = req.ip;
  const fingerprint = crypto
    .createHash("sha256")
    .update(ip + req.headers["user-agent"])
    .digest("hex");

  url.visits.push({
    timestamp: new Date(),
    ip,
    deviceType,
    referrer: req.get("referrer"),
    fingerprint,
  });
  await url.save();

  res.redirect(302, url.originalUrl);
});

// GET /analytics/:code
router.get("/analytics/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });
  if (!url) return res.sendStatus(404);

  const totalVisits = url.visits.length;
  const uniqueVisitors = new Set(url.visits.map((v) => v.fingerprint)).size;
  const byDevice = url.visits.reduce((acc, v) => {
    acc[v.deviceType] = (acc[v.deviceType] || 0) + 1;
    return acc;
  }, {});
  const byReferrer = url.visits.reduce((acc, v) => {
    acc[v.referrer || "Direct"] = (acc[v.referrer || "Direct"] || 0) + 1;
    return acc;
  }, {});
  const byTime = url.visits.reduce((acc, v) => {
    const date = v.timestamp.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  res.json({
    originalUrl: url.originalUrl,
    totalVisits,
    uniqueVisitors,
    byDevice,
    topReferrers: Object.entries(byReferrer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    timeSeries: byTime,
    tags: url.tags,
  });
});

// GET /tags/:tag
router.get("/tags/:tag", async (req, res) => {
  try {
    const urls = await Url.find({ tags: req.params.tag });
    const data = urls.map((u) => ({
      shortCode: u.shortCode,
      originalUrl: u.originalUrl,
      visits: u.visits.length,
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to filter by tag" });
  }
});

module.exports = router;

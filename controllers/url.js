const shortid = require("shortid");
const URL = require("../models/url");

const handleGenerateNewShortURL = async (req, res) => {
  const body = req.body;
  if (!body || !body.url)
    return res.status(400).json({ msg: "url is required." });
  const shortID = shortid.generate(8);
  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitedHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", {
    id: shortID,
  });
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortID: shortId });
  return res.json({
    totalClicks: entry.visitHistory.length,
    analytics: entry.visitHistory,
  });
};
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};

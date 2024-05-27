const shortid = require("shortid");
const URL = require("../models/url");

const handleGetShortURL = async (req, res) => {
  try {
    const urls = await URL.find().sort({ timestamp: "ascending" });
    res.json(urls);
  } catch (error) {
    console.error("Error retrieving URLs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleGenerateNewShortURL = async (req, res) => {
  const body = req.body;

  if (!body || !body.url)
    return res.status(400).json({ msg: "url is required." });

  const shortID = shortid.generate(8);

  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitedHistory: [],
    createdBy: req.user ? req.user._id : null,
  });

  return res.json({
    shortID,
  });

  // if (acceptHeader === "application/json") {
  //   console.log("fetched successfully");
  //   return res.json({
  //     id: shortID,
  //     message: "Short URL created successfully",
  //   });
  // } else {
  //   return res.render("home", {
  //     id: shortID,
  //   });
  // }
  // return res.render("home", {
  //   id: shortID,
  // });
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
  handleGetShortURL,
};

const express = require("express");

const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortURL,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/", handleGetShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;

const express = require("express");
const path = require("path");
require("dotenv").config();
const { connectToMongoDb } = require("./connection");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");

// Routers
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { checkForAuthentication, restrictTo } = require("./middleware/auth");
const mongoDbURI = process.env.MONGODB_URI;

connectToMongoDb(mongoDbURI)
  .then(() => {
    console.log("Connected to Db");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const PORT = 3001;

// to telling the server that we are using ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find();
  return res.render("home", {
    urls: allUrls,
  });
});

app.use("/url", restrictTo(["NORMAL"]), urlRoute); //Here we use a inline middleware. restrictToLoggedinUserOnly will execute only if we get a request for /url.
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortID: shortId,
    },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!entry) {
    return res.status(404).json({ msg: "url not found" });
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

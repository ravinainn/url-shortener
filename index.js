const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./connection");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { checkForAuthentication, restrictTo } = require("./middleware/auth");

connectDB(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;

// to telling the server that we are using ejs as view engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

const corsOptions = {
  origin: "https://ravi-url-shortener.vercel.app/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(checkForAuthentication);

app.use("/url", urlRoute);
// app.use("/url", restrictTo(["NORMAL"]), urlRoute); //Here we use a inline middleware. restrictToLoggedinUserOnly will execute only if we get a request for /url.
// app.use("/", staticRoute);
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
  const redirectURL = entry.redirectURL.startsWith("http")
    ? entry.redirectURL
    : `http://${entry.redirectURL}`;

  return res.redirect(redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

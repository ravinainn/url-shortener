const User = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.render("home");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user) {
    return res.render("login", { error: "Invalid UserName or Password" });
  }

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
  // return res.json({ token });
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};

const User = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  try {
    await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    console.log(error);
  }

  return res.render("home");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });

  if (!user) {
    return res.json({ status: "error", user: false });
  }

  const token = setUser(user);
  return res.json({ status: "ok", token });
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};

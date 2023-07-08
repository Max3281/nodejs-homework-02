const User = require("../models/users");

const {
  registerSchemaValid,
  loginSchemaValid,
} = require("../validationSchemas");
const { HttpError } = require("../helpers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const { error } = registerSchemaValid.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing required name field");
    }

    const passHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: passHash,
    });

    res.status(201);
    res.json({
      email: newUser.email,
      password: newUser.password,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passComp = await bcrypt.compare(password, user.password);

  if (!user || !passComp) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { error } = loginSchemaValid.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing required name field");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200);
  res.json({ token });
};

const currentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(200);
  res.json({
    message: "Logout success",
  });
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
};

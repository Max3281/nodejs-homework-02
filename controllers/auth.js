const User = require("../models/users");
const gravatar = require("gravatar");

const {
  registerSchemaValid,
  loginSchemaValid,
  verifyEmailSchema,
} = require("../validationSchemas");
const { HttpError } = require("../helpers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sgMail");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

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
    const grav = `${gravatar.url(email)}` + "?s=250";
    const avatarURL = grav;
    const verificationToken = nanoid(9);

    console.log(verificationToken);

    const newUser = await User.create({
      ...req.body,
      password: passHash,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify Email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

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

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200);
  res.json({
    message: "Verification successful",
  });
};

const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const { error } = verifyEmailSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing required name field");
  }

  if (!user) {
    throw HttpError(400, "Missing required name field");
  }

  if (user.verify) {
    // throw HttpError(400, "Verification has already been passed");
    res.status(400);
    res.json({ message: "Verification has already been passed" });
    return;
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200);
  res.json({ message: "Verification email sent" });
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  verifyEmail,
  resendVerification,
};

const User = require("../models/users");

const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const avatarDirPath = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDirPath, fileName);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200);
  res.json({ avatarURL });
};

module.exports = updateAvatar;

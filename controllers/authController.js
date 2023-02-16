const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require('path');
const fs = require("fs/promises");

const signup = async (req, res, next) => {
  const {email,password} = req.body;
  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const avatarURL = gravatar.url(email, {protocol: "http", default: "wavatar"})
    const saveUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL
    });

    return res.status(201).json({
      user: {
        email,
        subscription: saveUser.subscription,
        avatarURL
      },
    })
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "Email in use");
    }
    throw error;
  }
};

const login = async (req, res, next) => {
  const {email,password} = req.body;
  
  const storeUser = await User.findOne({
    email,
  });

  if (!storeUser) {
    throw new HttpError(401, "Email or password is wrong");
  }
  
  const isPasswordValid = await bcrypt.compare(password, storeUser.password);
  
  if (!isPasswordValid) {
    throw new HttpError(401,"Email or password is wrong")
  }

  const payload = { id: storeUser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await User.findByIdAndUpdate(storeUser._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: storeUser.subscription,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  return res.status(204).json();
};

const getCurrentUser = async (req, res, next) => {
  const { email, subscription } = req.user;

  return res.status(200).json({
    email,
    subscription,
  });
};

const changeSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const changeSubscription = await User.findByIdAndUpdate(_id, { subscription }, { new: true });

  return res.status(200).json(changeSubscription);
};

const updateAvatar = async (req, res, next) => {
  const { path: tmpPath, originalname } = req.file;
  const { _id: id } = req.user
  const avatarName = `${id}_${originalname}`;
  const avatarDir = path.join(__dirname, "../public/avatars");
  try {
    const publicPath = path.join(avatarDir, avatarName);
    await fs.rename(tmpPath, publicPath);
    const avatarURL = path.join("public", "avatars", avatarName);
    await User.findByIdAndUpdate(id, { avatarURL });
    res.json({ avatarURL })
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }
};


module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  changeSubscription,
  updateAvatar
};
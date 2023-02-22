const { HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require('path');
const fs = require("fs/promises");
const { v4 } = require("uuid");

const signup = async (req, res, next) => {
  const {email,password} = req.body;
  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verificationToken = v4();
    const avatarURL = gravatar.url(email, {protocol: "http", default: "wavatar"})
    const saveUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken
    });

    await sendEmail({
      to: email,
      subject: "Please confirm your email",
      html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Confirm your email</a>`,
      text: `Please, confirm your email address http://localhost:3000/users/verify/${verificationToken}`
    })

    return res.status(201).json({
      user: {
        email,
        subscription: saveUser.subscription,
        avatarURL,
        verificationToken
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

  if (!storeUser.verify) {
    throw new HttpError(
      401,
      "Email is not verified! Please check your mailbox"
    );
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

const verifyEmail = async (req,res,next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken,
  });

  if (!user) {
    throw new HttpError(404,'User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.json({
    message: 'Verification successful',
  });
}

const repeatVerifyEmail = async (req,res,next) => {
  const { email } = req.body;
  
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new HttpError(404,'User not found');
  }

  if (user.verify) {
    return res.status(400).json({
      message: 'Verification has already been passed',
    });
  }

  await sendEmail({
    to: email,
    subject: "Please, confirm your email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">Confirm your email</a>`
  })
  
  return res.json({
    message: 'Verification email success',
  });
}


module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  changeSubscription,
  updateAvatar,
  verifyEmail,
  repeatVerifyEmail
};
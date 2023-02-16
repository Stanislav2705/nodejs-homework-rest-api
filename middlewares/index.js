const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const multer = require("multer");
const path = require('path');
const Jimp = require("jimp");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(HttpError(400, error.message));
    }

    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  try {
    if (type !== "Bearer") {
      throw HttpError(401, "token type is not valid");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    
    if (!user || !user.token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw HttpError(401, "Jwt token is not valid");
    }
    next(err); 
  }
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 25721,
  },
});

const upload = multer({
  storage,
});

const changeSizeAvatar = async (req, res, next) => {
  const { path } = req.file;

  const avatar = await Jimp.read(path);
  const changeAvatar = avatar.resize(250, 250);

  await changeAvatar.writeAsync(path);

  next();
}

module.exports = {
  validateBody,
  auth,
  upload,
  changeSizeAvatar
};

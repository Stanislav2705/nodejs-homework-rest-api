const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    password: {
      type: String,
      trim: true,
      minLength: [8, "password should be at least 8 characters long"],
      required: [true,"Password is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true,"Email address is required"],
      match: [
        /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
    },
    token: {
        type: String,
        default: null,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", schema);

module.exports = {
  User,
};
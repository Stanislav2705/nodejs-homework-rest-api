const express = require("express");
const { signup, login, logout, getCurrentUser, changeSubscription, updateAvatar } = require("../../controllers/authController");

const authRouter = express.Router();

const { tryCatchWrapper } = require("../../helpers");
const { validateBody, auth, upload, changeSizeAvatar } = require("../../middlewares");
const { userSchema, subscriptionSchema } = require("../../schema/userSchema");


authRouter.post("/signup",validateBody(userSchema),tryCatchWrapper(signup));
authRouter.post("/login",validateBody(userSchema), tryCatchWrapper(login));
authRouter.get("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(getCurrentUser));
authRouter.patch("/", auth,validateBody(subscriptionSchema), tryCatchWrapper(changeSubscription));
authRouter.patch("/avatars",auth,upload.single("avatar"),tryCatchWrapper(changeSizeAvatar),tryCatchWrapper(updateAvatar))


module.exports = {
    authRouter
};
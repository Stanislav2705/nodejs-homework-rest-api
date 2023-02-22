const express = require("express");
const { signup, login, logout, getCurrentUser, changeSubscription, updateAvatar, verifyEmail, repeatVerifyEmail } = require("../../controllers/authController");

const authRouter = express.Router();

const { tryCatchWrapper } = require("../../helpers");
const { validateBody, auth, upload, changeSizeAvatar } = require("../../middlewares");
const { userSchema, subscriptionSchema, emailVerifyValidation } = require("../../schema/userSchema");


authRouter.post("/signup",validateBody(userSchema),tryCatchWrapper(signup));
authRouter.post("/login",validateBody(userSchema), tryCatchWrapper(login));
authRouter.get("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(getCurrentUser));
authRouter.patch("/", auth,validateBody(subscriptionSchema), tryCatchWrapper(changeSubscription));
authRouter.patch("/avatars",auth,upload.single("avatar"),tryCatchWrapper(changeSizeAvatar),tryCatchWrapper(updateAvatar))
authRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
authRouter.post("/verify",validateBody(emailVerifyValidation), tryCatchWrapper(repeatVerifyEmail));

module.exports = {
    authRouter
};
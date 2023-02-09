const express = require("express");
const { signup, login, logout, getCurrentUser, changeSubscription } = require("../../controllers/authController");

const authRouter = express.Router();

const { tryCatchWrapper } = require("../../helpers");
const { validateBody, auth } = require("../../middlewares");
const { userSchema, subscriptionSchema } = require("../../schema/userSchema");


authRouter.post("/signup",validateBody(userSchema),tryCatchWrapper(signup));
authRouter.post("/login",validateBody(userSchema), tryCatchWrapper(login));
authRouter.get("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(getCurrentUser));
authRouter.patch("/", auth,validateBody(subscriptionSchema), tryCatchWrapper(changeSubscription));



module.exports = {
    authRouter
};
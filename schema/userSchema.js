const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{7,30}$/)
    .messages({
      "string.pattern.base":
        "Invalid password: must contain length 7-30 characters; must be digits or latin letters.",
    })
    .required(),
});

const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = {
    userSchema,
    subscriptionSchema
};
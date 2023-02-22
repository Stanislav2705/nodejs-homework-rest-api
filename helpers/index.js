const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

function HttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const sendEmail = async (data) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    ...data,
    from: "stasrogal25@gmail.com",
  };
  await sgMail.send(msg);
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  sendEmail
};

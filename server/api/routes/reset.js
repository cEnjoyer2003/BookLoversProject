const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const pwdDTO = require("../dto/PasswordProvider");

const router = express.Router();

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "BookLoversProjectEmail@gmail.com",
    pass: "o k r r a g m t s x t y n h i t",
  },
});

router.use("/send-reset-pwd-code", async (request, response) => {
  let code = generateRandomNumber();
  const hash = await bcrypt.hash(code.toString(), 10);
  let codeExpire = Date.now() + 1000 * 60 * 3;
  const user = await pwdDTO.setCode(request.body.email, hash, codeExpire);
  if(!user) {
    response.send({ status: 404 });
    return;
  }
  let mailOptions = {
    from: "Booklovers <BookLoversProjectEmail@gmail.com>",
    to: user.email,
    subject: "Password reset",
    text: "If you didn't ask for a code to change the password, ignore this message. Don't pass the code to anyone.",
    html: `<p>Password reset code:</p><h1>${code}</h1>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      response.send({ status: 500 });
    } else {
      console.log("Email sent: " + info.response);
      response.send({ status: 200 });
    }
  });
});

router.use("/confirm-reset-pwd-code", async (request, response) => {
  const user = await pwdDTO.confirmCode(request.body.email);
  if (!user) {
    response.send({ status: 404 });
    return;
  } else if (!user.code) {
    response.send({ status: 401 });
    return;
  }
  const isValid = await bcrypt.compare(request.body.code, user.code);
  if (isValid && user.codeExpire > Date.now()) {
    response.send({ status: 200 });
  } else {
    response.send({ status: 400 });
  }
});

router.use("/reset-pwd", async (request, response) => {
  try {
    const hash = await bcrypt.hash(request.body.password, 10);
    const user = await pwdDTO.resetPwd(request.body.email, hash);;
    if (!user) {
      response.send({ status: 404 });
      return;
    }
    response.send({ status: 200, user: user });
  } catch (err) {
    console.log(err);
    response.send({ status: 500 });
    return;
  }
});

module.exports = router;

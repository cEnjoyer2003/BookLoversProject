const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const authDTO = require("../dto/AuthProvider");

router.use('/sign-in', async (request, response) => {
  try {
    const userData = await authDTO.signIn(request.body.username);
    if (!userData) {
      response.send({ status: 404 });
      return;
    };
    console.log(request.body);
    const isValid = await bcrypt.compare(request.body.password, userData.user.password);

    console.log(userData);
    if(userData.user.deleteMessage) {
      response.send({status: 401, deleteMessage: userData.user.deleteMessage});
      return;
    }
    if (isValid) {
      response.send({
        status: 200,
        user: userData.user,
        reviews: userData.reviews ? userData.reviews : [],
        tops: userData.tops ? userData.tops : [],
        quotes: userData.quotes ? userData.quotes : [],
      });
    } else {
      response.send({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/register", async (request, response) => {
  const hash = await bcrypt.hash(request.body.password, 10);
  try {
    const user = await authDTO.register(request.body, hash);
    if (user === 0) {
      response.send({ status: 400 });
      return;
    } else if (user === 1) {
      response.send({ status: 401 });
      return;
    }
    console.log(user);
    response.send({ status: 200, user: user });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});


module.exports = router;
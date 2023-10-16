const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const userDTO = require("../dto/UserProvider");

router.use("/edit", async (request, response) => {
  try {
    const hash = await bcrypt.hash(request.body.password, 10);
    const user = await userDTO.edit(request.body.oldUsername, request.body.username, request.body, hash);
    if (!user) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(user);
    response.send({ status: 200, user: user });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/get-user", async (request, response) => {
  try {
    const userData = await userDTO.get(request.body.username);
    if (!userData) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(userData);
    response.send({ 
      status: 200,
      user: userData.user,
      reviews: userData.reviews ? userData.reviews : [],
      tops: userData.tops ? userData.tops : [],
      quotes: userData.quotes ? userData.quotes : [],
     });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/edit-role", async (request, response) => {
  try {
    const user = await userDTO.editRole(request.body.username, request.body);
    if (!user) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(user);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/delete-messages", async (request, response) => {
  try {
    const user = await userDTO.deleteMessages(request.body.username);
    if (!user) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(user);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/delete-user", async (request, response) => {
  try {
    const user = await userDTO.delete(request.body.username, request.body);
    if (!user) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(user);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/delete-userdata", async (request, response) => {
  try {
    const user = await userDTO.deleteUserData(request.body.username);
    if (!user) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(user);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

module.exports = router;
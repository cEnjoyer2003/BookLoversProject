require("./db/init.js");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Routes are now separated in separate files
const authRoute = require("./routes/auth.js");
const resetRoute = require("./routes/reset.js");
const userRoute = require("./routes/user.js");
const entitiesRoute = require("./routes/entities.js");
const searchRoute = require("./routes/search.js");

const app = express();

const { User, Review, Top, Quote } = require("../schemas/schemas.js");

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoute);
app.use("/", resetRoute);
app.use("/", userRoute);
app.use("/", entitiesRoute);
app.use("/", searchRoute);

app.listen(5000, () => console.log("Example app is listening on port 5000."));



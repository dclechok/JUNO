const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../..", ".env") });

const assetsRouter = require("./db/assets/assets.router");
const physSitesRouter = require("./db/physical_sites/physical_sites.router");

const cors = require("cors");

const notFound = require('./db/errors/notFound');
const errorHandler = require('./db/errors/errorHandler');

app.use(cors()); //cross orgin reference sharing
app.use(express.json()); //express server
//route to our tables
app.use("/assets", assetsRouter);
app.use("/physical_sites", physSitesRouter);

//handle errors at the end
app.use(notFound);
app.use(errorHandler);


module.exports = app;
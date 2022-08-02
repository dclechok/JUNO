const express = require("express");
const app = express();
const path = require("path");
const pg = require('pg');

pg.defaults.poolSize = 5;

require("dotenv").config({ path: path.join(__dirname, "../..", ".env") });

const assetsRouter = require("./db/assets/assets.router");
const physSitesRouter = require("./db/physical_sites/physical_sites.router");
const history_logRouter = require("./db/history_log/history_log.router");
const usersRouter = require("./db/users/users.router");

const cors = require("cors");

const notFound = require('./db/errors/notFound');
const errorHandler = require('./db/errors/errorHandler');

app.use(express.json()); //express server
app.use(cors()); //cross orgin reference sharing

//route to our tables
app.use("/assets", assetsRouter);
app.use("/physical_sites", physSitesRouter);
app.use("/history_log", history_logRouter);
app.use("/users", usersRouter);

//handle errors at the end
app.use(notFound);
app.use(errorHandler);


module.exports = app;
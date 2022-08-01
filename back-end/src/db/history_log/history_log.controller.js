const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHasResultProperty(req, res, next) {
  //post request must have a body
  const { data } = req.body;
  if (data) return next(); //if body exists - move to validate body
  next({ status: 400, message: "A request body is required." });
}

function validateBody(req, res, next) {
  //post request must have the required body data
  if (req.body.data.length > 1) {
    req.body.data.forEach((entry) => {
      const { logged_action, logged_by, logged_date, history_key } = entry;
      //validate each separate piece of the requests body data
      if (!logged_action)
        return next({
          status: 400,
          message:
            "History log requires a logged action type (bulk upload, single upload, edit asset, move asset, etc).",
        });
      if (!logged_by)
        return next({
          status: 400,
          message: "History log requires an action_by entry.",
        });
      if (!logged_date)
        return next({
          status: 400,
          message: "History log requires a date (logged_date).",
        });
      if (!history_key)
        return next({
          status: 400,
          message: "History log requires a history log key (history_key).",
        });
    });
  }
  next(); //validated - onto next middleware
}

async function list(req, res) {
  const data = await knex("history_log").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const result = req.body.data;
  const data = await knex("history_log")
    .insert(result)
    .returning("*")
    .then((results) => results[0]); //insert body data into assets
  res.status(201).json({ data });
}

async function read(req, res) {
  //return single history log via history key
  const { history_key } = req.params;
  const data = await knex("history_log")
    .select("*")
    .where("history_key", history_key)
    .then((results) => results[0]);
  res.json(data);
}

async function readByID(req, res){
  //list all history logs by ID
  const { user_id } = req.params;
  const data = await knex("history_log")
    .select("*")
    .where("logged_by_id", user_id)
  res.json(data);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)],
  read: asyncErrorBoundary(read),
  readByID: asyncErrorBoundary(readByID)
  //update
  //delete
};

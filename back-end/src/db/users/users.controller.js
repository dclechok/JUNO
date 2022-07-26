const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/// START VALIDATION MIDDLEWARE ///

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
      const { username, hash, email, name, access_level } = entry;
      //validate each separate piece of the requests body data
      if (!username)
        return next({
          status: 400,
          message: "Asset must include an asset tag for entry.",
        });
      if (!hash)
        return next({
          status: 400,
          message: "Asset must include a location.",
        });
      if (!email)
        return next({
          status: 400,
          message: "Asset must include a serial number.",
        });
      if (!name)
        return next({
          status: 400,
          message: "Asset must include a make.",
        });
      if (!access_level)
        return next({
          status: 400,
          message: "Asset must include a model.",
        });
    });
  }
  next(); //validated - onto next middleware
}

/// END VALIDATION MIDDLEWARE ///
async function list(req, res) {
  const data = await knex("users").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const result = {
    ...req.body.data,
    history: JSON.stringify(req.body.data.history),
  };
  const data = await knex("users")
    .insert(result)
    .returning("*")
    .then((results) => results[0]); //insert body data into assets
  res.status(201).json({ data });
}

async function read(req, res) {
  //create new asset in the system
  const { user_id } = req.params;
  const data = await knex("users")
    .select("*")
    .where({ user_id, user_id })
    .then((results) => results[0]);
  res.status(201).json({ data });
}

async function update(req, res) {
  // const { id } = req.params;
  // const { status } = req.body.data;
  // let { history } = req.body.data;
  // history = JSON.stringify(history); //restringify
  // const data = await knex("physical_sites")
  // .where("physical_site_id", id)
  // .update({
  //   status, status,
  //   history, history
  // })
  // .returning('*')
  // .then((results) => results[0]);
  // res.status(200).json({ data });
  console.log("hello");
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)], // TODO: verify each data field format
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
  //create
  //read
  //update
  //delete
};

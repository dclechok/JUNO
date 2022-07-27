const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const bcrypt = require('bcryptjs'); //salt and hash our passwords
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
    });4
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
    hash: bcrypt.hashSync(req.body.data.hash, 15)
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
  const { user_id } = req.params;
  const { username, name, hash: newHash, email, access_level } = req.body.data;
  const history = JSON.stringify(req.body.data.history); //restringify
  if(newHash){ //if we're updating password, hash it and store it
    const hash = bcrypt.hashSync(newHash, 15);
    const data = await knex("users")
    .where("user_id", user_id)
    .update({
      username, username,
      name, name,
      hash, hash,
      email, email,
      access_level, access_level,
      history, history
    })
    .returning('*')
    .then((results) => results[0]);
    res.status(200).json({ data });
  }else{ //not updating a password
    const data = await knex("users")
    .where("user_id", user_id)
    .update({
      username, username,
      name, name,
      email, email,
      access_level, access_level,
      history, history
    })
    .returning('*')
    .then((results) => results[0]);
    res.status(200).json({ data });
  }
}

async function deactivate(req, res){
  const { user_id } = req.params;
  const { status } = req.body.data;
  const history = JSON.stringify(req.body.data.history);
  console.log(user_id);
  const data = await knex("users")
  .where("user_id", Number(user_id))
  .update({
    status, status,
    history, history
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)], // TODO: verify each data field format
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
  deactivate: asyncErrorBoundary(deactivate)
};

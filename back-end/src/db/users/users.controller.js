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
          message: "User must include a username.",
        });
      if (!hash)
        return next({
          status: 400,
          message: "User must include a password.",
        });
      if (!email)
        return next({
          status: 400,
          message: "User must include an email.",
        });
      if (!name)
        return next({
          status: 400,
          message: "User must include a name.",
        });
      if (!access_level)
        return next({
          status: 400,
          message: "User must include an access level.",
        });
    });4
  }
  next(); //validated - onto next middleware
}

function validatePassForUpdate(req, res, next){ //for updating passwords
  const { data } = req.body;
  if(data[0].new_password1 === data[0].new_password2){ //make sure new password fields are the same
    if(bcrypt.compareSync(data[0].old_password, data[1].hash)){ //if "old password" aka current password matches
      return next();
    }else return next({
      status: 400, 
      message: "Current password field does not match existing password."
    })
  }else return next({
    status: 400, 
    message: "New password fields do not match!"
  })
}

function validatePassFormat(req, res, next){
  const password = Array.isArray(req.body.data) ? req.body.data[0].new_password1 : req.body.data.hash;
  if(password.length > 7) return next();
  else return next({
    status: 400,
    message: "Password must be at least 8 characters!"
  })
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

async function updatePass(req, res){
  const { user_id } = req.params;
  const { new_password1 } = req.body.data[0];
  const history = JSON.stringify(req.body.data[1].history);
  const hash = bcrypt.hashSync(new_password1, 15);
  const data = await knex("users")
  .where("user_id", Number(user_id))
  .update({
    hash, hash,
    history, history
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });

}

async function deactivate(req, res){
  const { user_id } = req.params;
  const { status } = req.body.data;
  const history = JSON.stringify(req.body.data.history);
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
  create: [bodyHasResultProperty, validateBody, validatePassFormat, asyncErrorBoundary(create)], // TODO: verify each data field format
  read: asyncErrorBoundary(read),
  update: [bodyHasResultProperty, validatePassFormat, asyncErrorBoundary(update)],
  updatePass: [bodyHasResultProperty, validatePassFormat, validatePassForUpdate, asyncErrorBoundary(updatePass)],
  deactivate: asyncErrorBoundary(deactivate)
};

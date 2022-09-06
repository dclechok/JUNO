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
  const { physical_site_name, site_code } = req.body.data;
  //validate each separate piece of the requests body data
  if (!physical_site_name)
    return next({
      status: 400,
      message: "Job site must include a physical site name tag for entry.",
    });
  if (!site_code)
    return next({
      status: 400,
      message: "Job site must include a site code.",
    });
  next(); //validated - onto next middleware
}

async function list(req, res) {
  const data = await knex("physical_sites").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const result = {...req.body.data, history: JSON.stringify(req.body.data.history)};
  const data = await knex("physical_sites")
    .insert(result)
    .returning("*")
    .then((results) => results[0]); //insert body data into physical_sites
  res.status(201).json({ data });
}

async function read(req, res) {
  const { physical_site_id } = req.params;
  const data = await knex("physical_sites").select("*").where({ physical_site_id, physical_site_id });
  res.json(data);
}

async function update(req, res) {
  const { physical_site_id } = req.params;
  const { physical_site_name, site_code, first_octet, category, updated_at } = req.body.data;
  let { history } = req.body.data;
  history = JSON.stringify(history); //restringify
  const data = await knex("physical_sites")
  .where("physical_site_id", Number(physical_site_id))
  .update({
    physical_site_name, physical_site_name,
    site_code, site_code,
    first_octet, first_octet,
    history, history,
    category, category,
    updated_at, updated_at
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

async function deactivate(req, res) { //update, do not delete
  //remove asset from db
  const { physical_site_id } = req.params;
  const { status } = req.body.data;
  let { history } = req.body.data;
  history = JSON.stringify(history); //restringify
  const data = await knex("physical_sites")
  .where("physical_site_id", Number(physical_site_id))
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
  create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)],
  read: asyncErrorBoundary(read),
  update: [bodyHasResultProperty, validateBody, asyncErrorBoundary(update)],
  remove: asyncErrorBoundary(deactivate)
};

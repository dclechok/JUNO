const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
  const { physical_site_name, site_code, first_octet } = req.body.data;
  let { history } = req.body.data;
  history = JSON.stringify(history); //restringify
  const data = await knex("physical_sites")
  .where("physical_site_id", physical_site_id)
  .update({
    physical_site_name, physical_site_name,
    site_code, site_code,
    first_octet, first_octet,
    history, history
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

async function deactivate(req, res) { //update, do not delete
  //remove asset from db
  const { id } = req.params;
  const { status } = req.body.data;
  let { history } = req.body.data;
  history = JSON.stringify(history); //restringify
  const data = await knex("physical_sites")
  .where("physical_site_id", id)
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
  create: asyncErrorBoundary(create),
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
  remove: asyncErrorBoundary(deactivate)
};

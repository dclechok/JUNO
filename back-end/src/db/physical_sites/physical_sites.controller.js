const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await knex("physical_sites").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const result = req.body.data;
  const data = await knex("physical_sites")
    .insert(result)
    .returning("*")
    .then((results) => results[0]); //insert body data into assets
  res.status(201).json({ data });
}

async function remove(req, res) {
  //remove asset from db
  const { id } = req.params;
  const data = await knex("physical_sites")
  .where("physical_site_id", id)
  .del();
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
  // read: asyncErrorBoundary(read),
  //update
  delete: asyncErrorBoundary(remove)
};

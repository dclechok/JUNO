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
  if(!Array.isArray(req.body.data)) req.body.data = [req.body.data];
  req.body.data.forEach(entry => {
    const { asset_tag, location, serial_number, make, model, hr } = entry;
  //validate each separate piece of the requests body data
  if (!asset_tag)
    return next({
      status: 400,
      message: "Asset must include an asset tag for entry.",
    });
  if (!location)
    return next({
      status: 400,
      message: "Asset must include a location.",
    });
  if (!serial_number)
    return next({
      status: 400,
      message: "Asset must include a serial number.",
    });
  if (!make)
    return next({
      status: 400,
      message: "Asset must include a make.",
    });
  if (!model)
    return next({
      status: 400,
      message: "Asset must include a model.",
    });
  if (!hr)
    return next({
      status: 400,
      message: "Asset must include a hashrate (hr).",
    });
  })
  next(); //validated - onto next middleware
}

/// END VALIDATION MIDDLEWARE ///
async function list(req, res) {
  const data = await knex("assets").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const chunkSize = 120000;
  const result = !Array.isArray(req.body.data) ? { //stringify single asset history into json array
    ...req.body.data, history: JSON.stringify(req.body.data.history)
  } : req.body.data.map(data => {return {...data, history: JSON.stringify(data.history)}}); //stringify each bulk asset's history into json array
  const data = await knex
    // .insert(result)
    .batchInsert('assets', result, chunkSize)
    .returning("*")
    .then((results) => results[0]); //return result
  res.status(201).json({ data });
}

async function read(req, res) {
  //return single asset via asset_tag
  const { asset_id } = req.params;
  const data = await knex("assets")
    .select("*")
    .where("asset_id", asset_id)
    .then((results) => results[0]);
  res.json(data);
}

async function update(req, res) {
  //update asset
  const { asset_id } = req.params;
  //fields we can update
  const { asset_tag, serial_number, make, model, hr, updated_at } = req.body.data[0];
  const history = JSON.stringify(req.body.data[0].history);
  const data = await knex('assets')
  .where('asset_id', asset_id)
  .update({
    asset_tag, asset_tag,
    serial_number, serial_number,
    make, make,
    model, model,
    hr, hr, 
    history, history,
    updated_at, updated_at
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

async function remove(req, res) {
  //remove asset from db
  const { asset_id } = req.params;
  const data = await knex("assets")
  .where("asset_id", asset_id)
  .del();
  res.status(200).json({ data });
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)], // TODO: verify each data field format
  read: asyncErrorBoundary(read), //read individual asset
  update: [bodyHasResultProperty, validateBody, asyncErrorBoundary(update)],
  delete: asyncErrorBoundary(remove)
};

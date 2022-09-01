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
//validate location data
// function validateLoc(req, res, next){
//   const { first_octet, mdc, shelf, unit } = req.body.data;
//   //these ranges can be changed via req.body.data
//   if(Array.isArray(req.body.data)){
//     req.body.data.forEach(asset => {
//       const {first_octet, mdc, shelf, unit} = asset.location.site_loc;
//       if(Number(first_octet) <= 0 || Number(first_octet) > 99)
//       return next({ status: 400, message: `First octet is out of range! (Must be between 01-99)`});
//     if(Number(mdc) <= 0 || Number(mdc) > 99)
//       return next({ status: 400, message: `MDC is out of range! (Must be between 01-99)`});
//     if(Number(shelf) <= 0 || Number(shelf) > 14)
//       return next({ status: 400, message: `Shelf is out of range! (Must be between 01-14`});
//     if(Number(unit) <= 0 || Number(unit) > 588)
//       return next({ status: 400, message: `Unit is out of range! (Must be between 01-42`});
//     })
//   }
//   next();
// }

/// END VALIDATION MIDDLEWARE ///
async function list(req, res) {
  const data = await knex("assets").select("*");
  res.json(data);
}

async function create(req, res) {
  //create new asset in the system
  const chunkSize = 12000;
  const date = new Date();
  const result = !Array.isArray(req.body.data) ? { //stringify single asset history into json array
    ...req.body.data, history: JSON.stringify(req.body.data.history)
  } : req.body.data.map(data => {return {...data, history: JSON.stringify(data.history), updated_at: JSON.stringify(date)}}); //stringify each bulk asset's history into json array
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
  const { asset_tag, serial_number, make, model, hr, location, status } = req.body.data[0];
  const history = JSON.stringify(req.body.data[0].history);
  const updated_at = new Date(); //time is now
  const data = await knex('assets')
  .where('asset_id', asset_id)
  .update({
    asset_tag, asset_tag,
    serial_number, serial_number,
    make, make,
    model, model,
    hr, hr, 
    history, history,
    location, location,
    status, status,
    updated_at, updated_at
  })
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

async function bulkUpdate(req, res){
  const site = req.body.data;
  const data = await knex('assets')
  // .whereRaw(`location -> 'site' = '${site.physical_site_name}'`)
  .whereJsonSupersetOf('location', { "site": site.physical_site_name })
  .update("status", "Pending Transfer") //todo: update history as well
  .returning('*')
  .then((results) => results[0]);
  res.status(200).json({ data });
}

//we no longer want to permanently delete assets
//TODO: DEACTIVATE assets
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
  bulkUpdate: asyncErrorBoundary(bulkUpdate), //for when a site is deactivated, set all assets belonging to that site to Pending Transfer
  update: [bodyHasResultProperty, validateBody, asyncErrorBoundary(update)],
  delete: asyncErrorBoundary(remove)
};

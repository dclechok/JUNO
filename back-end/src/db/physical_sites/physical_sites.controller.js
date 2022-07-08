const knex = require('../connection');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res) {
    const data = await knex('physical_sites').select('*');
    res.json(data);
}

module.exports = {
    list: asyncErrorBoundary(list),
    // create: [bodyHasResultProperty, validateBody, asyncErrorBoundary(create)],
    // read: asyncErrorBoundary(read),
    //create
    //read
    //update
    //delete
};
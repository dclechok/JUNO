const assets = require('./01-assets.json');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex
    .raw("TRUNCATE TABLE assets RESTART IDENTITY CASCADE")
    .then(() => {
      return knex('assets').insert(assets);
    });
};

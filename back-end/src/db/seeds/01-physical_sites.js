
 const physical_sites = require('./01-physical_sites.json');

 exports.seed = async function(knex) {
   // Deletes ALL existing entries
   return knex
     .raw("TRUNCATE TABLE physical_sites RESTART IDENTITY CASCADE")
     .then(() => {
       return knex('physical_sites').insert(physical_sites);
     });
 };
 
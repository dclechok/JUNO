exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.string("status", '');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.dropColumn("status");
    });
  };
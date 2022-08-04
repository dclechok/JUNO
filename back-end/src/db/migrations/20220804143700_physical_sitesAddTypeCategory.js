exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.string("category");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.dropColumn("category");
    });
  };
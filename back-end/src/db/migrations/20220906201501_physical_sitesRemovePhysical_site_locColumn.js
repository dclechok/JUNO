exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.dropColumn("physical_site_loc");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.string("physical_site_loc");
    });
  };
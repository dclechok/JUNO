exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.json("history", {});
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.dropColumn("history");
    });
  };
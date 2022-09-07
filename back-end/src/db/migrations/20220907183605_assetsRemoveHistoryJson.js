exports.up = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("history");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.json("history");
    });
  };
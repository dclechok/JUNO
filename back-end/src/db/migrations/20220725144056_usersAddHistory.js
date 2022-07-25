exports.up = function (knex) {
    return knex.schema.table("users", (table) => {
      table.json("history");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("users", (table) => {
      table.dropColumn("history");
    });
  };
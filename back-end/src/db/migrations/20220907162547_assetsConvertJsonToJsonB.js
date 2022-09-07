exports.up = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("history");
      table.jsonb("history");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("history");
      table.json("history");
    });
  };
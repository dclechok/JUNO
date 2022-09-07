exports.up = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.jsonb("history");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("history");
    });
  };
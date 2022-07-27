exports.up = function (knex) {
    return knex.schema.table("users", (table) => {
      table.string("status");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("users", (table) => {
      table.dropColumn("status");
    });
  };
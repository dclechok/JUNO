exports.up = function (knex) {
    return knex.schema.table("history_log", (table) => {
      table.jsonb("logged_details");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("history_log", (table) => {
      table.dropColumn("logged_details");
    });
  };
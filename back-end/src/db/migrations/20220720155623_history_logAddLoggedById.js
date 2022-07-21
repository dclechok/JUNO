exports.up = function (knex) {
    return knex.schema.table("history_log", (table) => {
      table.string("logged_by_id", '');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("history_log", (table) => {
      table.dropColumn("logged_by_id");
    });
  };
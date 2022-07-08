exports.up = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.string("value", "");
      table.string("invoice_num", "");
      table.string("EOL_date", "");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("value");
      table.dropColumn("invoice_num");
      table.dropColumn("EOL_date");
    });
  };
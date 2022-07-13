exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.string("created_by", "");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("assets", (table) => {
      table.dropColumn("created_by");
    });
  };
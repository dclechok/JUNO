exports.up = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.string("site_code");
      table.string("first_octet");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("physical_sites", (table) => {
      table.dropColumn("site_code");
      table.dropColumn("first_octet");
    });
  };
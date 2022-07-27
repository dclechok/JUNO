exports.up = function (knex) {
    return knex.schema.alterTable('assets', function (table) {
      table.unique('asset_tag');
      table.unique('serial_number');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('assets', function (table) {
      table.dropUnique('asset_tag');
      table.dropUnique('serial_number');
    });
  };
exports.up = function (knex) {
    return knex.schema.alterTable('assets', function (table) {
      table.dropColumn('physical_siteId');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('assets', function (table) {
      table.addColumn('physical_siteId');
    });
  };

exports.up = function(knex) {
    return knex.schema.createTable("physical_sites", (table) => {
        table.increments("physical_site_id").primary(); // sets physical_site_id as the primary key
        table.string("physical_site_name"); //Mawson's serialization\
        table.string("physical_site_loc");
        table.timestamps(true, true); // adds created_at and updated_at columns; passing true as the first argument sets the columns to be a timestamp type while passing true as the second argument sets those columns to be non-nullable and to use the current timestamp by default
      });
};

exports.down = function(knex) {
    return knex.schema.raw("DROP TABLE physical_sites CASCADE");
};

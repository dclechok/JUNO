exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
      table.increments("user_id").primary(); // sets asset_id as the primary key
      table.string("username");
      table.string("hash"); //hashed and salted pw
      table.string("email");
      table.string("name"); //real world name
      table.string("access_level"); //engineer, analyst, admin
      table.timestamps(true, true); // adds created_at and updated_at columns; passing true as the first argument sets the columns to be a timestamp type while passing true as the second argument sets those columns to be non-nullable and to use the current timestamp by default
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.raw("DROP TABLE users CASCADE");
  };
  
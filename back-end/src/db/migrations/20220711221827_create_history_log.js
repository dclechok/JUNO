exports.up = function (knex) {
    return knex.schema.createTable("history_log", (table) => {
        table.increments("history_log_id").primary(); // sets history_log_id as the primary key
        table.string("logged_action"); //bulk upload, single upload, edit, etc  
        table.string("logged_by"); //by real name
        table.string("logged_date"); 
        table.string('history_key'); //to act similarly to foreign key, reference key in asset.history.key
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.raw("DROP TABLE history_log CASCADE");
  };
  
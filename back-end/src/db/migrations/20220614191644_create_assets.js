exports.up = function (knex) {
    return knex.schema.createTable("assets", (table) => {
      table.increments("asset_id").primary(); // sets asset_id as the primary key
      table.string("asset_tag"); //Mawson's serialization
      table.integer('physical_siteId').unsigned().nullable(); //set up for foreign key
      table
        .foreign("physical_siteId") //our foreign key on job sites table
        .references("physical_site_id")
        .inTable("physical_sites")
        .onDelete("cascade");
      table.json("location"); //physical location + site(10)/mdc/shelf/unit + / storage / repair (which location) / retired
      table.string("serial_number"); //actual machine SN/barcode
      table.string("make");
      table.string("model");
      table.string("hr"); //nameplate hash power
      table.json("history"); //object that includes all historical data for the device (action taken, action date, action by, optional comment)
      table.string("status"); //deployed, repair, drap
      table.timestamps(true, true); // adds created_at and updated_at columns; passing true as the first argument sets the columns to be a timestamp type while passing true as the second argument sets those columns to be non-nullable and to use the current timestamp by default
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.raw("DROP TABLE assets CASCADE");
  };
  
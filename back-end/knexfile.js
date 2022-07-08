require("dotenv").config();
const { DATABASE_URL } = process.env;
const path = require("path");

module.exports = {

  development: {    
      client: "postgresql",
      connection: DATABASE_URL,
      migrations: {
        directory: path.join(__dirname, "src", "db", "migrations"),
      },
      seeds: {
        directory: path.join(__dirname, "src", "db", "seeds"),
      },
    }
};

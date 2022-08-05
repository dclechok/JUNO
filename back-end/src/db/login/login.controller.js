const knex = require("../connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const bcrypt = require('bcryptjs'); //salt and hash our passwords

/// START VALIDATION MIDDLEWARE ///

async function login(req, res){
    const { unhashed, user } = req.body.data;
    if(bcrypt.compareSync(unhashed, user.hash))
        res.status(200).json({ user });
    else res.status(404).send({ error: "Incorrect Username/Password!" });
}

module.exports = {
    login: asyncErrorBoundary(login)
}
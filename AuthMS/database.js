const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

// let db = new sqlite3.Database("./dbStore.db");

// db.serialize(function () {
//     db.run(
//         `CREATE TABLE IF NOT EXISTS users
//         (id INTEGER PRIMARY KEY,
//         username TEXT UNIQUE,
//         hashed_password BLOB)`
//     );

//     //create starter users
//     const saltRounds = 10;
//     let username = "test-user";
//     let clearPass = "qwerty";
//     let passHash;

//     bcrypt.hash(clearPass, saltRounds, function (err, hash) {
//         passHash = hash;
//         db.run(
//             `INSERT OR IGNORE INTO users (username, hashed_password) VALUES ('${username}', '${passHash}')`
//         );
//     });
// });

// module.exports = db;

// //mongoDb connection
require("dotenv").config();
const mongoose = require("mongoose");
let uri;

uri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:32000/?authMechanism=DEFAULT`;
process.env.MONGO_URI;

mongoose
    .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log(err));

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;

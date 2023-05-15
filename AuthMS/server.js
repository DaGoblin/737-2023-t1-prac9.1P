const express = require("express");
require("dotenv").config();
const app = express();
const passport = require("passport");
//const session = require("express-session");
// require("./database");
const User = require("./database");
const auth = require("./auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { use } = require("chai");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const jwtSecret = "ThisIsTheSecret";
const saltRounds = 10;
//Auth APi Routes
app.post("/login", function (req, res, next) {
    passport.authenticate(
        "local",
        { session: false },
        (err, username, info) => {
            if (err || !username) {
                console.log(`${username}`);
                return res.status(400).json({
                    message: "That didn't work",
                    username: username,
                    info: info,
                });
            }
            req.login(username, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign(username, jwtSecret);
                return res.json({ token });
            });
        }
    )(req, res);
});

app.get("/", (req, res) => {
    res.send("Auth Microservice");
});

app.get("/loggedin", (req, res) => {
    res.send("logged in");
});

app.get(
    "/JWTDetails",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.send(req.user);
    }
);

app.post("/createAccount", (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;

        User.findOne({ username: username }).then((user) => {
            if (user) {
                console.log("user already exists");
                res.send("user already exists");
            } else {
                //Validation
                // if the email does not exist, it saves the users input to a variable "newUser"
                const newUser = new User({
                    username,
                    password,
                });
                //Password Hashing
                //This encrypts the password with bcrypt

                bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                    //if (err) throw err;

                    newUser.password = hash;
                    newUser
                        .save() //password is saved after encryption
                        .then(res.send("User Created")) //user is redirected to the email verification page
                        .catch((err) => console.log(err));
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.delete("/deleteAccount", (req, res) => {
    try {
        const username = req.query.username;

        User.deleteOne({ username: username }).then((user) => {
            console.log(user);
            if (user.deletedCount == 0) {
                console.log(`${username} not found`);
                res.send(`${username} not found`);
            } else {
                console.log(`${username} Deleted`);
                res.send(`${username} Deleted`);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.post("/updatePassword", async (req, res) => {
    try {
        const username = req.query.username;
        const oldPassword = req.query.oldpassword;
        const newPassword = req.query.newpassword;

        let returnedUser = await User.findOne({ username: username }); //find users in Mongo DB
        if (!returnedUser) {
            console.log(`${username} not found`);
            res.send(`${username} not found`);
        }

        await bcrypt.compare(
            oldPassword,
            returnedUser.password,
            async function (err, result) {
                if (result) {
                    returnedUser.password = await bcrypt.hash(
                        newPassword,
                        saltRounds
                    );
                    await returnedUser.save();
                    console.log(`${username} Password Updated`);
                    res.send(`${username} Password Updated`);
                } else {
                    console.log("Wrong password");
                    res.send("Wrong password");
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(
        `Authentication Microservice listening at http://localhost:${PORT}`
    );
});

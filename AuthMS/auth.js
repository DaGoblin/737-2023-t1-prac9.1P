var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var user = require("./database");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//Creates Passport local strategy checks sqlite3 DB for usedname and checks password against hasted
// passport.use(
//     new LocalStrategy(function verify(username, password, cb) {
//         db.get(
//             `SELECT * FROM users WHERE username = '${username}'`,
//             async function (err, row) {
//                 if (err) {
//                     return cb(err);
//                 }
//                 if (!row) {
//                     return cb(null, false, {
//                         message: "Incorrect username or password.",
//                     });
//                 }

//                 const check = await bcrypt.compare(
//                     password,
//                     row.hashed_password
//                 );

//                 if (check) {
//                     let userDetails = { id: row.id, username: row.username };
//                     return cb(null, userDetails);
//                 } else {
//                     return cb(null, false, {
//                         message: "Incorrect username or password.",
//                     });
//                 }
//             }
//         );
//     })
// );

passport.use(
    new LocalStrategy(function verify(username, password, done) {
        user.findOne({ username: username }) //find users in Mongo DB
            .then((User) => {
                if (!User) {
                    console.log("Wrong Username");
                    return done("Wrong Username");
                }

                bcrypt.compare(password, User.password, function (err, result) {
                    if (result) {
                        let userDetails = {
                            id: User.id,
                            username: User.username,
                        };
                        return done(null, userDetails);
                    } else {
                        console.log("Wrong password");
                        return done("Wrong password");
                    }
                });

                // match = bcrypt
                //     .compare(password, user.password)
                //     .then((error, isMatch) => {
                //         console.log(isMatch);
                //         if (isMatch) {
                //             return done(null, user);
                //         } else {
                //             console.log("Wrong password");
                //             return done();
                //         }
                //     });
            })
            .catch((error) => console.log(error));
    })
);

// passport.use(
//     new LocalStrategy({ username: "username" }, (username, password, done) => {
//         //Check customer

//         User.findOne({ username: username }) //find users email in Mongo DB
//             .then((username) => {
//                 if (!username) {
//                     console.log("wrong email");

//                     return done();
//                 }

//                 //Match Password
//                 bcrypt.compare(password, user.password, (error, isMatch) => {
//                     if (error) throw error;
//                     if (isMatch) {
//                         return done(null, user);
//                     } else {
//                         console.log("Wrong password");

//                         return done();
//                     }
//                 });
//             })
//             .catch((error) => console.log(error));
//     })
// );

const jwtSecret = "ThisIsTheSecret";

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        },
        function (jwtPayload, cb) {
            let userDetails = {
                id: jwtPayload.id,
                username: jwtPayload.username,
            };
            return cb(null, userDetails);
        }
    )
);

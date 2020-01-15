const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {ensureAuthenticated} = require('../helpers/auth');
const passport = require("passport");
const router = express.Router();

// Load User Model
require("../models/User");
const User = mongoose.model("users");


// Login Form POST

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send({text:'wrong information',error:true}) }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({text:'correct',error:false});
    });
  })(req, res, next);
});

router.post("/register",ensureAuthenticated, (req, res) => {
  let errors = [];
  if (req.body.email == 0) {
    errors.push({ text: "Please enter a username" });
  }
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match"});
  }
  if (errors.length > 0) {
    let str = " "
    for (i in errors){
      str.concat(errors[i.text])
    }
    console.log(str)
    res.send({text:str,error:true})
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          res.send({text:"Username is taken",error:true})
          // console.log('error_msg')
        } else {
          const newUser = new User({
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              // if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.send({text:"Account registered. You can now log in",error:false})
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      })
      .catch(user => {
        res.send({text:"Username is taken",error: true});
      });
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/')
});

module.exports = router;

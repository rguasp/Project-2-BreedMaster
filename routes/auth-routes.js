const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
const User        = require("../models/user");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Please indicate username,password, and Email" });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "Sorry, that username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username:username,
      password: hashPass,
      email:email
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local",
{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}
));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}

authRoutes.get('/profile/:userId', (req, res, next) => {
  // console.log(req.user);
  if(req.user === undefined){
    res.redirect("/login")
    return;
  }
  res.render('auth/profile', {user: req.user});
});

authRoutes.get('/profile/edit/:userId', function (req, res) {
  User.findById(req.params.userId)
  .then(theUser => {
    res.render('editUser', {user: req.user})
  })
})


authRoutes.post('/profile/update/:userId', function (req, res) {
  console.log('bio: ', req.body.bio);
User.findByIdAndUpdate(req.params.userId, {
    bio: req.body.bio,
  })
  
  .then(response => {
    res.redirect(`/profile/${req.params.userId}`)
    //console.log(car);
  })
  .catch(theError => { 
    console.log(theError)
  })

})

module.exports = authRoutes;
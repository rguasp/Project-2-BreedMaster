const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
const User        = require("../models/user");
const Dog        = require("../models/dog");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const multer  = require('multer');
const uploadCloud = require('../config/cloudinary.js');

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
  const data = {};

  if(req.user === undefined){
    res.redirect("/login")
    return;
  }else if( JSON.stringify(req.user._id) === JSON.stringify(req.params.userId) ){
    data.OWNER = true;
  }
  User.findById(req.params.userId)
  .then(theUser => {
    console.log(theUser);
    data.user = theUser;
    Dog.find({owner: req.user.username})
    .then((dogsOwned) => {
      console.log(dogsOwned);
      data.dogs = dogsOwned;
      res.render('auth/profile', data)
    })
  })


});

  // res.render('auth/profile', {user: req.user});

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

authRoutes.get('/dogs', function (req, res) {
  if(req.user === undefined){
    res.redirect("/login")
    return;
  }
  Dog.find()
  .then(dogs => {
    console.log(dogs)
    let data = {};
    data.theList = dogs;
    data.user = req.user;
    res.render('dogsList', data)
  })
  .catch(theError => { console.log(theError) })
})

authRoutes.get('/dogs/new/', function (req, res) {

  if(req.user === undefined){
    res.redirect("/login")
    return;
  }
  console.log(req)
  res.render('newDog')
})

authRoutes.post('/dogs/create/', uploadCloud.single('photo'),
 function (req, res) {
  // console.log("req body", req.body);

  const theActualName = req.body.theName
  const theActualBreed = req.body.theBreed
  const theActualAge = req.body.theAge
  // const theActualImgPath = req.file.url;

  // const theActualOwner = req.body.userId;
  const newDog = new Dog({});


  
  newDog.name = theActualName;
  newDog.breed = theActualBreed;
  newDog.age =theActualAge;
  newDog.owner = req.user.username;
  newDog.createdBy = req.user._id;
    if(req.file !== undefined){
      newDog. imgPath = req.file.url;
    }
    console.log("new dog before: ", newDog)
  newDog.save()
  .then(dog => {
    console.log("new dog after: ", dog)

    res.redirect(`/profile/${req.user._id}`)
    //console.log(car);
  })
  .catch(theError => { 
    console.log(theError)
  })
  
})

authRoutes.post('/dogs/delete/:id', function (req, res) {
  let data = {};
  const dogId = req.params.id;
  data.user = req.user;
  Dog.findByIdAndRemove(dogId)
  .then(dog => {
    console.log(dog);
  })
  .catch(error => {
    console.log(error);
  })
  res.redirect(`/profile/${req.user._id}`)
})

// app.get('/dogs/edit/:id', function (req, res) {
//   Dog.findById(req.params.id)
//   .then(theDog => {
//     res.render('editDog', {dog: req.dog})
//   })
// })


// app.post('/cars/update/:id', function (req, res) {
// Car.findByIdAndUpdate(req.params.id, {
//     brand: req.body.brand,
//     model: req.body.model,
//     year: req.body.year,
//     color: req.body.color,
//   })


//   .then(car => {
//     //console.log(car);
//   })
//   .catch(theError => { 
//     console.log(theError)
//   })

//   res.redirect('/cars')
// })

module.exports = authRoutes;
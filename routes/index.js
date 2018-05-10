const express = require('express');
const router  = express.Router();
const User        = require("../models/user");

/* GET home page */
router.get('/', (req, res, next) => {
  // res.locals.user = req.user;
   const data = {};


  if(req.user){
    data.user = req.user;  
  }
  res.render('index', data);
});

module.exports = router;

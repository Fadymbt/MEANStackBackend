const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.redirect('/homepage');
  try {
    res.send('Why are you here?!');
  } catch (error) {
    next(error)
  }
});

module.exports = router;

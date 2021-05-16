const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  // res.redirect('/homepage');
  res.send('Why are you here?!')
});

module.exports = router;

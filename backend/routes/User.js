const express = require('express');
const router = express.Router();

const UserCtrl = require('../models/User');

// Les routes
router.post('/signup', userCrlt.signup);
router.post('/login', userCrtl.login)


module.exports = router;
var express = require('express');
var router = express.Router();
var AuthController = require('../controller/AuthController');
/* GET home page. */
router.post('/login',AuthController.Login);
router.post('/register',AuthController.Register);


module.exports = router;

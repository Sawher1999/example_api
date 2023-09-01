const express = require('express');
var router = express.Router();
var controller = require('../controllers/member.js');

router.get('/login', controller.login);
router.post('/member/saveInventory', controller.saveInventory);

module.exports = router;
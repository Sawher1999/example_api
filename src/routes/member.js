const express = require('express');
var router = express.Router();
var controller = require('../controllers/member.js');

router.get('/login', controller.login);
router.post('/member/saveInventory', controller.saveInventory);
// router.post('/member/create',  controller.create);
// router.get('/members', controller.find);
// router.get('/member/:id', controller.findOne);
// router.get('/member', controller.findByIdentifier);

module.exports = router;
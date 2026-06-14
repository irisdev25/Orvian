const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/login', (req, res) => res.render('pages/login', { layout: false }));
router.get('/register', (req, res) => res.render('pages/register', { layout: false }));

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

module.exports = router;

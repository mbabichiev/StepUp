const express = require("express");
const AuthController = require("../controllers/AuthController.js");
const authMidleware = require('../middlewares/AuthMiddleware');
const {body} = require('express-validator');

const authRouter = express.Router();
const authController = new AuthController();


authRouter.post("/register", 
    body('email').isEmail(), 
    body('login').isLength({min: 6, max: 12}), 
    body('firstname').isLength({min: 1, max: 12}), 
    body('lastname').isLength({min: 1, max: 12}), 
    body('password').isLength({min: 6, max: 12}), 
    authController.register);
    
authRouter.post('/login', 
    body('login').isLength({min: 6, max: 12}), 
    body('password').isLength({min: 6, max: 12}), 
    authController.login);

authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/profile', authMidleware, authController.profile);
authRouter.post('/reset', body('email').isEmail(), authController.sendLinkToResetPassword)
authRouter.post('/reset/:token', body('password').isLength({min: 6, max: 12}), authController.resetPassword)


module.exports = authRouter;
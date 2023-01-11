const express = require("express");
const UserController = require("../controllers/UserController.js");
const EventController = require("../controllers/EventController");
const authMidleware = require('../middlewares/AuthMiddleware');
const forbiddenMiddleware = require('../middlewares/ForbiddenMiddleware');
const {body} = require('express-validator');

const userRouter = express.Router();
const userController = new UserController();
const eventController = new EventController();


userRouter.put('/:login', authMidleware, forbiddenMiddleware,
    body('login')
        .if(body('login').exists())
        .isLength({min: 6, max: 12}),
    body('email')
        .if(body('email').exists())
        .isEmail(),
    body('firstname')
        .if(body('firstname').exists())
        .isLength({min: 1, max: 12}),
    body('lastname')
        .if(body('lastname').exists())
        .isLength({min: 1, max: 12}),
    body('description')
        .isLength({max: 255}),
    body('official')
        .if(body('official').exists())
        .isBoolean(),
    userController.updateUserByLogin);

userRouter.put('/:login/photo', authMidleware, forbiddenMiddleware, userController.updateUserPhotoByLogin);
userRouter.get('/:login', userController.getUserByLogin);
userRouter.get('/:login/photo', userController.getUserPhotoByLogin);
userRouter.get('/:login/events', eventController.getUserEventsByQueryParams);
userRouter.get('/:login/events/signed', eventController.getSignedEventsByQueryParams);
userRouter.delete('/:login', authMidleware, forbiddenMiddleware, userController.deleteUserByLogin);
userRouter.delete('/:login/photo', authMidleware, forbiddenMiddleware, userController.deleteUserPhotoByLogin);


module.exports = userRouter;
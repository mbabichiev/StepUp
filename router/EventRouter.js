const express = require("express");
const EventController = require("../controllers/EventController");
const WalletController = require("../controllers/WalletController");
const authMidleware = require('../middlewares/AuthMiddleware');
const eventMiddleware = require('../middlewares/EventMiddleware');
const { body } = require('express-validator');

const eventRouter = express.Router();
const eventController = new EventController();
const walletController = new WalletController();


eventRouter.post('/',
    authMidleware,
    body('name').isLength({ min: 5, max: 100 }),
    body('description').isLength({ max: 255 }),
    body('country').isLength({ min: 1, max: 30 }),
    body('city').isLength({ min: 1, max: 30 }),
    body('street').isLength({ min: 1, max: 60 }),
    body('house_number').isLength({ min: 1, max: 30 }),
    body('people_limit').if(body('people_limit').exists()).isInt({ min: 0 }),
    body('category_id').isLength({ min: 24, max: 24 }),
    body('price').isInt({ min: 0 }),
    body('time_start').isInt({ min: 0 }),
    body('time_end').isInt({ min: 0 }),
    eventController.createEvent);

eventRouter.put('/:id', authMidleware, eventMiddleware,
    body('name').if(body('name').exists()).isLength({ min: 5, max: 100 }),
    body('description').if(body('description').exists()).isLength({ max: 255 }),
    body('country').if(body('country').exists()).isLength({ min: 1, max: 30 }),
    body('city').if(body('city').exists()).isLength({ min: 1, max: 30 }),
    body('street').if(body('street').exists()).isLength({ min: 1, max: 60 }),
    body('house_number').if(body('house_number').exists()).isLength({ min: 1, max: 30 }),
    body('people_limit').if(body('people_limit').exists()).isInt({ min: 0 }),
    body('category_id').if(body('category_id').exists()).isLength({ min: 24, max: 24 }),
    body('time_start').if(body('time_start').exists()).isInt({ min: 0 }),
    body('time_end').if(body('time_end').exists()).isInt({ min: 0 }),
    body('active').if(body('active').exists()).isBoolean(),
    eventController.updateEvent);

eventRouter.put('/:id/photo', authMidleware, eventMiddleware, eventController.uploadPhoto);

eventRouter.post('/:id/subscribe', authMidleware, walletController.subscribeForEvent);
eventRouter.post('/:id/unsubscribe', authMidleware, walletController.unsubscribeFromEvent);

eventRouter.get('/:id', eventController.getEvent);
eventRouter.get('/:id/photo', eventController.getEventPhoto);
eventRouter.get('/', eventController.getAllEventsByQueryParams);
eventRouter.get('/ip/:ip', eventController.getNearEventsByQueryParams);
eventRouter.get('/:id/subscribers', eventController.getSubscribersOfEvent);

eventRouter.delete('/:id', authMidleware, eventMiddleware, eventController.deleteEvent);
eventRouter.delete('/:id/photo', authMidleware, eventMiddleware, eventController.deleteEventPhoto);

module.exports = eventRouter;
const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const authMidleware = require('../middlewares/AuthMiddleware');

const notificationRouter = express.Router();
const notificationController = new NotificationController();

notificationRouter.get('/', authMidleware, notificationController.getNotifications);

module.exports = notificationRouter;
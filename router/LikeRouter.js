const express = require("express");
const LikeController = require("../controllers/LikeController");
const authMidleware = require('../middlewares/AuthMiddleware');

const likeRouter = express.Router();
const likeController = new LikeController();

likeRouter.post('/:event_id', authMidleware, likeController.createLike);
likeRouter.get('/:event_id', authMidleware, likeController.getLike);
likeRouter.delete('/:event_id', authMidleware, likeController.deleteLike);

module.exports = likeRouter;
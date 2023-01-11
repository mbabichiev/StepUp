const express = require("express");
const CommentController = require("../controllers/CommentController");
const authMidleware = require('../middlewares/AuthMiddleware');
const { body } = require('express-validator');
const commentMiddleware = require("../middlewares/CommentMiddleware");

const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.post('/:event_id',
    authMidleware,
    body('content').isLength({ min: 1, max: 255 }),
    commentController.createComment);

commentRouter.put('/:comment_id',
    authMidleware,
    commentMiddleware,
    body('content').if(body('content').exists()).isLength({ min: 1, max: 255 }),
    commentController.updateComment);

commentRouter.get('/:event_id', commentController.getComments);
commentRouter.delete('/:comment_id', authMidleware, commentMiddleware, commentController.deleteComment);


module.exports = commentRouter;
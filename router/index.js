const express = require('express');
const authRouter = require('./AuthRouter');
const categoryRouter = require('./CategoryRouter');
const commentRouter = require('./CommentRouter');
const eventRouter = require('./EventRouter');
const likeRouter = require('./LikeRouter');
const notificationRouter = require('./NotificationRouter');
const userRouter = require('./UserRouter');
const walletRouter = require('./WalletRouter');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/events', eventRouter);
router.use('/comments', commentRouter);
router.use('/likes', likeRouter);
router.use('/wallet', walletRouter);
router.use('/notifications', notificationRouter);

module.exports = router;
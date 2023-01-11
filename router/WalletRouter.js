const express = require("express");
const WalletController = require("../controllers/WalletController");
const authMidleware = require('../middlewares/AuthMiddleware');
const { body } = require('express-validator');

const walletRouter = express.Router();
const walletController = new WalletController();

walletRouter.post("/top-up", authMidleware,
    body('number_card').isLength({ min: 16, max: 16 }).isNumeric(),
    body('cvv').isLength({ min: 3, max: 3 }).isNumeric(),
    body('expires_end').custom(value => {
        if (value.length !== 5) {
            return false;
        }

        const data = value.split('/');
        if (data.length !== 2) {
            return false;
        }

        if (data[0].length !== 2 && data[1].length !== 2) {
            return false;
        }

        const month = Number(data[0]);

        if (month < 0 || month > 12) {
            return false;
        }

        const year = Number(data[1]);
        if (year < 23) {
            return false;
        }
        return true;
    }),
    body('amount').isInt().custom(value => {
        if (Number(value) < 10) {
            return false;
        }
        return true;
    }),
    walletController.addMoneyToWallet);

walletRouter.post("/withdraw", authMidleware,
    body('number_card').isLength({ min: 16, max: 16 }).isNumeric(),
    body('amount').isInt().custom(value => {
        if (Number(value) < 10) {
            return false;
        }
        return true;
    }),
    walletController.withdrawMoneyFromWallet);

walletRouter.get("/", authMidleware, walletController.getOwnMoneyFromWallet);


module.exports = walletRouter;
const {validationResult} = require('express-validator');
const ErrorHandler = require('../exeptions/ErrorHandler');
const walletService = require('../services/WalletService');

class WalletController {

    async addMoneyToWallet(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {amount} = request.body;
            const {user} = request;

            await walletService.addMoneyToWalletByUserId(user.id, amount);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async withdrawMoneyFromWallet(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {amount} = request.body;
            const {user} = request;

            await walletService.withdrawMoneyByUserId(user.id, amount);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async getOwnMoneyFromWallet(request, response, next) {
        try {

            const {user} = request;
            const amount = await walletService.getAmountByUserId(user.id);

            return response.status(200).json(amount);
        }
        catch(e) {
            next(e);
        }
    }


    async subscribeForEvent(request, response, next) {
        try {

            const {user} = request;
            const event_id = request.params.id;

            await walletService.payForEvent(user.id, event_id);
            return response.status(200).json();
        }
        catch(e) {
            next(e);
        }
    }


    async unsubscribeFromEvent(request, response, next) {
        try {

            const {user} = request;
            const event_id = request.params.id;
            await walletService.unsubscribeFromEventAndReturnMoney(user.id, event_id);

            return response.status(200).json();
        }
        catch(e) {
            next(e);
        }
    }
    
}

module.exports = WalletController;
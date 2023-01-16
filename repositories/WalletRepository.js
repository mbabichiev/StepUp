const WalletModel = require('../models/Wallet');
const ErrorHandler = require('../exceptions/ErrorHandler');


class CategoryRepository {


    async findById(id) {
        const wallet = await WalletModel.findById(id);
        if (!wallet) {
            throw ErrorHandler.BadRequest("Wallet not found");
        }
        return wallet;
    }


    async findByUserId(user_id) {
        const wallet = await WalletModel.findOne({ user_id });
        if (!wallet) {
            throw ErrorHandler.BadRequest("Wallet not found");
        }
        return wallet;
    }
}

module.exports = new CategoryRepository();
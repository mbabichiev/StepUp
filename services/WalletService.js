const ErrorHandler = require("../exeptions/ErrorHandler");
const WalletModel = require("../models/Wallet");
const WalletDto = require("../dtos/WalletDto");
const UserModel = require("../models/User");
const EventModel = require("../models/Event");
const mongoose = require('mongoose');

class WalletService {

    async createWallet(user_id) {
        console.log("Create wallet by user with id: " + user_id);

        if (await WalletModel.findOne({ user_id })) {
            throw ErrorHandler.BadRequest("You already have a wallet")
        }

        const wallet = await WalletModel.create({
            user_id: user_id
        });

        return new WalletDto(wallet);
    }


    async getAmountByUserId(user_id) {
        console.log("Get amount of wallet by user id: " + user_id);

        const wallet = await WalletModel.findOne({ user_id });
        if (!wallet) {
            throw ErrorHandler.BadRequest("Wallet not found");
        }

        return { amount: wallet.amount };
    }


    async addMoneyToWalletByUserId(user_id, amount) {
        console.log("Add amount " + amount + " to wallet by user id: " + user_id);

        let wallet = await WalletModel.findOne({ user_id });
        if (!wallet) {
            wallet = await WalletModel.create({
                user_id: user_id,
                amount: amount
            });
            return;
        }

        wallet.amount += Number(amount);
        wallet.save();
    }


    async withdrawMoneyByUserId(user_id, amount) {
        console.log("Withdraw amount " + amount + " from wallet by user id: " + user_id);

        let wallet = await WalletModel.findOne({ user_id });
        if (!wallet) {
            throw ErrorHandler.BadRequest("You don't have wallet")
        }

        const pending_event = await EventModel.findOne({ $and: [{ author_id: user_id }, { time_end: { $lt: Date.now() } }] });
        if (pending_event) {
            throw ErrorHandler.BadRequest("You can't withdraw money while you have pending events");
        }

        if (wallet.amount < amount) {
            throw ErrorHandler.BadRequest("You don't have this amount of money");
        }

        wallet.amount -= Number(amount);
        await wallet.save();
    }


    async payForEvent(user_id, event_id) {
        console.log("Paying for event with id: " + event_id + " by user with id: " + user_id);

        const event = await EventModel.findById(event_id);
        if (!event) {
            throw ErrorHandler.BadRequest("Event with id " + event_id + " not found");
        }

        if (event.author_id == user_id) {
            throw ErrorHandler.BadRequest("You can't subscribe to your event")
        }

        if (event.subscribers.indexOf(user_id) !== -1) {
            throw ErrorHandler.BadRequest("You already subscribed for this event");
        }

        if (!event.active || event.people_limit === event.subscribers.length - 1) {
            throw ErrorHandler.BadRequest("Event with id " + event_id + " not active");
        }

        const user = await UserModel.findById(user_id);
        if (!user) {
            throw ErrorHandler.BadRequest("User with id " + user_id + " not found");
        }

        let from_wallet;

        if (event.price !== 0) {
            from_wallet = await WalletModel.findOne({ user_id: user._id });
            if (from_wallet.amount < event.price) {
                throw ErrorHandler.BadRequest("You don't have money");
            }
        }

        const to_user = await UserModel.findById(event.author_id);

        let to_wallet;
        if (event.price !== 0) {
            to_wallet = await WalletModel.findOne({ user_id: to_user._id });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (event.price !== 0) {
                from_wallet.amount -= event.price;
                to_wallet.amount += event.price;
            }
            user.available_events.push(event._id);
            event.subscribers.push(user._id);

            if (event.subscribers.length === event.people_limit) {
                event.active = false;
            }

            if (event.price !== 0) {
                await from_wallet.save();
                await to_wallet.save();
            }
            await user.save();
            await event.save();
            if (event.price !== 0) {
                console.log("Success transaction from wallet with id " + from_wallet._id + " to wallet with id: " + to_wallet._id);
            }
            console.log("Success subcribing to event with id: " + event_id);
        }
        catch (err) {
            console.log(err);
            await session.abortTransaction();
        }
        finally {
            session.endSession();
        }
    }


    async unsubscribeFromEventAndReturnMoney(user_id, event_id) {
        console.log("Unsubscribe from event with id: " + event_id + " by user with id: " + user_id);

        const event = await EventModel.findById(event_id);
        if (!event) {
            throw ErrorHandler.BadRequest("Event with id " + event_id + " not found");
        }

        if (event.subscribers.indexOf(user_id) === -1) {
            throw ErrorHandler.BadRequest("You didn't subscribe for this event");
        }

        const user = await UserModel.findById(user_id);
        const author_of_event = await UserModel.findById(event.author_id);

        let user_wallet;
        let author_of_event_wallet;

        if (event.price !== 0) {
            user_wallet = await WalletModel.findById(user.wallet_id);
            if (!user_wallet) {
                user_wallet = await WalletModel.create({
                    user_id: user_id
                });
            }

            author_of_event_wallet = await WalletModel.findById(author_of_event.wallet_id);
            if (!author_of_event_wallet) {
                author_of_event_wallet = await WalletModel.create({
                    user_id: author_of_event._id
                });
            }
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (event.price !== 0) {
                user_wallet.amount += event.price;
                author_of_event_wallet.amount -= event.price;
            }
            let indexOfEvent = user.available_events.indexOf(event._id);
            user.available_events.splice(indexOfEvent, 1);

            let indexOfUser = event.subscribers.indexOf(user._id);
            event.subscribers.splice(indexOfUser, 1);

            if (!event.active && event.subscribers.length !== event.people_limit) {
                event.active = true;
            }

            if (event.price !== 0) {
                await user_wallet.save();
                await author_of_event_wallet.save();
            }
            await user.save();
            await event.save();
            if (event.price !== 0) {
                console.log("Success transaction from author wallet with id " + author_of_event_wallet._id + " to wallet with id: " + user_wallet._id);
            }
            console.log("Success unsubcribing from event with id: " + event_id);
        }
        catch (err) {
            console.log(err);
            await session.abortTransaction();
        }
        finally {
            session.endSession();
        }
    }
}


module.exports = new WalletService();
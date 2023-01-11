const {Schema, model} = require('mongoose');


const Wallet = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    amount: {type: Number, required: true, default: 0},
});


module.exports = model('Wallet', Wallet);
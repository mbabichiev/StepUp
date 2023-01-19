const {Schema, model} = require('mongoose');

const User = new Schema({
    login: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    description: {type: String},
    official: {type: Boolean, default: false, required: true},
    phone_number: {type: String},
    chat_id: {type: Number, unique: true},
    wallet_id: {type: Schema.Types.ObjectId, ref: 'Wallet'},
    role: {type: String, default: "user"},
    subscribers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    available_events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    time_admin: {type: Number}
});

module.exports = model('User', User);
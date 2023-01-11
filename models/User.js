const {Schema, model} = require('mongoose');

const User = new Schema({
    login: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    description: {type: String},
    official: {type: Boolean, default: false, required: true},
    role: {type: String, default: "user"},
    available_events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    time_admin: {type: Number}
});

module.exports = model('User', User);
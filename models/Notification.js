const {Schema, model} = require('mongoose');


const Notification = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, required: true},
    link: {type: String},
    date: {type: Number, required: true, default: Date.now()}
});


module.exports = model('Notification', Notification);
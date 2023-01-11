const {Schema, model} = require('mongoose');

const Event = new Schema({
    author_id: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String},
    country: {type: String, required: true},
    city: {type: String, required: true},
    street: {type: String, required: true},
    house_number: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    people_limit: {type: Number},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true},
    active: {type: Boolean, required: true, default: true},
    subscribers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    likes: {type: Number, requires: true, default: 0},
    time_start: {type: Number, required: true},
    time_end: {type: Number, required: true}
});

module.exports = model('Event', Event);
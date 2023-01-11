const {Schema, model} = require('mongoose');

const Comment = new Schema({
    author_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    event_id: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
    content: {type: String, required: true},
    publish_date: {type: Number, required: true}
});

module.exports = model('Comment', Comment);
const {Schema, model} = require('mongoose');


const Like = new Schema({
    author_id: {type: Schema.Types.ObjectId, ref: 'User'},
    event_id: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = model('Like', Like);
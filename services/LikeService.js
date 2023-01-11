const ErrorHandler = require('../exeptions/ErrorHandler');
const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const LikeModel = require('../models/Like');
const CommentModel = require('../models/Comment');
const LikeDto = require('../dtos/LikeDto');

class LikeService {

    async create(author_id, event_id) {
        console.log("Create like by user with id: " + author_id);

        if (await LikeModel.findOne({ $and: [{ author_id: author_id }, { event_id: event_id }] })) {
            throw ErrorHandler.BadRequest("You already liked this event");
        }

        const event = await EventModel.findById(event_id);
        if (!event) {
            throw ErrorHandler.BadRequest(`Event with id '${event_id}' not found`);
        }

        LikeModel.create({
            author_id: author_id,
            event_id: event_id
        });

        event.likes++;
        event.save();
    }


    async getByAuthorIdAndEventId(author_id, event_id) {
        console.log("Get like with author id: " + author_id);

        const like = await LikeModel.findOne({ $and: [{ author_id: author_id }, { event_id: event_id }] });
        if (!like) {
            throw ErrorHandler.BadRequest("You didn't like this event");
        }

        return new LikeDto(like);
    }


    async deleteByAuthorIdAndEventId(author_id, event_id) {
        console.log("Delete like with author id: " + author_id);

        const like = await LikeModel.findOne({ $and: [{ author_id: author_id }, { event_id: event_id }] });
        if(!like) {
            throw ErrorHandler.BadRequest("Like not found");
        }

        like.deleteOne();

        const event = await EventModel.findById(event_id);
        event.likes--;
        event.save();
    }
}

module.exports = new LikeService();
const ErrorHandler = require('../exceptions/ErrorHandler');
const LikeModel = require('../models/Like');
const LikeDto = require('../dtos/LikeDto');
const eventRepository = require('../repositories/EventRepository');


class LikeService {


    async create(author_id, event_id) {
        console.log("Create like by user with id: " + author_id);

        if (await LikeModel.findOne({ $and: [{ author_id: author_id }, { event_id: event_id }] })) {
            throw ErrorHandler.BadRequest("You already liked this event");
        }

        const event = await eventRepository.findById(event_id);

        LikeModel.create({
            author_id: author_id,
            event_id: event._id
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

        const event = await eventRepository.findById(event_id);
        event.likes--;
        event.save();
    }
}

module.exports = new LikeService();
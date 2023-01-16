const CommentModel = require('../models/Comment');
const ErrorHandler = require('../exceptions/ErrorHandler');
const eventRepository = require('./EventRepository');


class CommentRepository {

    
    async findById(id) {
        const comment = await CommentModel.findById(id);
        if (!comment) {
            throw ErrorHandler.BadRequest(`Comment with id ${id} not found`);
        }
        return comment;
    }


    async findByParams(event_id, limit, sort, page) {
        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }

        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if (sort && sort !== 'new' && sort !== 'old') {
            throw ErrorHandler.BadRequest("Sort should be 'new' or 'old'");
        }

        const event = await eventRepository.findById(event_id);

        if (!limit) {
            limit = 10;
        }
        if (!sort) {
            sort = 'new';
        }
        if (!page) {
            page = 0;
        }

        let sorting = { publish_date: -1 };
        if(sort === 'old') {
            sorting = { publish_date: 1 };
        }

        page++;
        return await CommentModel.find({ event_id: event._id })
                .skip(page > 0 ? ((page - 1) * limit) : 0)
                .limit(limit)
                .sort(sorting);
    }

}

module.exports = new CommentRepository();
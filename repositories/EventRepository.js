const EventModel = require('../models/Event');
const ErrorHandler = require('../exceptions/ErrorHandler');


class EventRepository {

    async findById(id) {
        const event = await EventModel.findById(id);
        if (!event) {
            throw ErrorHandler.BadRequest(`Event with id ${id} not found`);
        }
        return event;
    }


    async findByParams(condition, limit, sort, type, page) {
        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }

        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if (sort && sort !== 'earliest' && sort !== 'latest' && sort !== 'popular') {
            throw ErrorHandler.BadRequest("Sort should be 'earliest', 'latest' or 'popular'");
        }

        if (type && type !== 'active' && type !== 'inactive') {
            throw ErrorHandler.BadRequest("Type should be 'active' or 'inactive'");
        }

        if (!limit) {
            limit = 10;
        }
        if (!sort) {
            sort = 'earliest';
        }
        if (!page) {
            page = 0;
        }

        let sorting = {};
        if (sort === 'latest') {
            sorting = { time_start: 1 };
        }
        else if (sort === 'earliest') {
            sorting = { time_start: -1 };
        }
        else if (sort === 'popular') {
            sorting = { likes: -1 };
        }

        let active = {};
        if (type === 'inactive') {
            active = { active: false };
        }
        else if (type === 'active') {
            active = { active: true };
        }

        page++;
        return await EventModel.find({ $and: [condition, active] })
            .limit(limit)
            .skip(page > 0 ? ((page - 1) * limit) : 0)
            .sort(sorting);
    }

}

module.exports = new EventRepository();
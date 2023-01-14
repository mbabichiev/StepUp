const ErrorHandler = require('../exceptions/ErrorHandler');
const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const CommentModel = require('../models/Comment');
const CommentDto = require('../dtos/CommentDto');
const Notificater = require('../utils/Notificater');

class CommentService {

    async create(author_id, event_id, content) {
        console.log("Create comment by user with id: " + author_id);

        const user = await UserModel.findById(author_id);
        if (!user) {
            throw ErrorHandler.BadRequest(`User with id '${author_id}' not found`);
        }

        const event = await EventModel.findById(event_id);
        if (!event) {
            throw ErrorHandler.BadRequest(`Event with id '${event_id}' not found`);
        }

        const comment = await CommentModel.create({
            author_id: user._id,
            event_id: event._id,
            content: content,
            publish_date: Date.now()
        });

        Notificater.notificateOtherUsers(
            content, 
            `User @${user.login} notificated you in comments under event "${event.name}"`,
            `${process.env.CLIENT_URL}/events/${event._id}`);

        const commentDto = new CommentDto(comment, user);
        return commentDto;
    }


    async getById(id) {
        console.log("Get comment with id: " + id);

        const comment = await CommentModel.findById(id);
        if (!comment) {
            throw ErrorHandler.BadRequest(`Comment with id '${id}' not found`);
        }

        const user = await UserModel.findById(comment.author_id);

        const commentDto = new CommentDto(comment, user);
        return commentDto;
    }


    async getByLimitAndSort(event_id, limit, sort, page) {
        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }

        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if (sort && sort !== 'new' && sort !== 'old') {
            throw ErrorHandler.BadRequest("Sort should be 'new' or 'old'");
        }

        if (!limit) {
            limit = 10;
        }

        if (!sort) {
            sort = 'new';
        }

        if (!page) {
            page = 0;
        }

        console.log(`Get page of comments with event_id: '${event_id}', limit: ${limit}, sort: '${sort}', page: ${page}`);

        const event = await EventModel.findById(event_id);
        if (!event) {
            throw ErrorHandler.BadRequest(`Event with id '${event_id}' not found`);
        }

        let comments;
        page++;
        if (sort === 'new') {
            comments = await CommentModel.find({ event_id: event_id })
                .skip(page > 0 ? ((page - 1) * limit) : 0)
                .limit(limit)
                .sort({ publish_date: -1 });
        }
        else if (sort === 'old') {
            comments = await CommentModel.find({ event_id: event_id })
                .skip(page > 0 ? ((page - 1) * limit) : 0)
                .limit(limit)
                .sort({ publish_date: 1 });
        }

        const commentsDto = [];
        for (var i = 0; comments[i]; i++) {
            const user = await UserModel.findById(comments[i].author_id);
            commentsDto.push(new CommentDto(comments[i], user));
        }

        return commentsDto;
    }


    async updateById(id, content) {
        console.log("Update comment with id: " + id);

        if (!content) {
            return;
        }

        const comment = await CommentModel.findById(id);
        if (!comment) {
            throw ErrorHandler.BadRequest(`Comment with id '${id}' not found`);
        }

        comment.content = content;
        await comment.save();
    }


    async deleteById(id) {
        console.log("Delete comment with id: " + id);

        const comment = await CommentModel.findById(id);
        if (!comment) {
            throw ErrorHandler.BadRequest(`Comment with id '${id}' not found`);
        }

        await CommentModel.findByIdAndDelete(id);
    }
}

module.exports = new CommentService();
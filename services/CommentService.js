const UserModel = require('../models/User');
const CommentModel = require('../models/Comment');
const CommentDto = require('../dtos/CommentDto');
const Notificater = require('../utils/Notificater');
const userRepository = require('../repositories/UserRepository');
const eventRepository = require('../repositories/EventRepository');
const commentRepository = require('../repositories/CommentRepository');


class CommentService {

    async create(author_id, event_id, content) {
        console.log("Create comment by user with id: " + author_id);

        const user = await userRepository.findById(author_id);
        const event = await eventRepository.findById(event_id);

        const comment = await CommentModel.create({
            author_id: user._id,
            event_id: event._id,
            content: content
        });

        Notificater.notificateOtherUsers(
            content, 
            `User @${user.login} notificated you in comments under event "${event.name}"`,
            `${process.env.CLIENT_URL}/events/${event._id}`);

        return new CommentDto(comment, user);;
    }


    async getById(id) {
        console.log("Get comment with id: " + id);

        const comment = await commentRepository.findById(id);
        const user = await userRepository.findById(comment.author_id);

        return new CommentDto(comment, user);
    }


    async getByLimitAndSort(event_id, limit, sort, page) {
        console.log(`Get page of comments with event_id: '${event_id}', limit: ${limit}, sort: '${sort}', page: ${page}`);

        const comments = await commentRepository.findByParams(event_id, limit, sort, page);
        const commentsDto = [];
        for (var i = 0; comments[i]; i++) {
            const user = await UserModel.findById(comments[i].author_id);
            commentsDto.push(new CommentDto(comments[i], user));
        }

        return commentsDto;
    }


    async updateById(id, content) {
        console.log("Update comment with id: " + id);

        const comment = await commentRepository.findById(id);
        comment.content = content;
        comment.save();
    }


    async deleteById(id) {
        console.log("Delete comment with id: " + id);

        const comment = await commentRepository.findById(id);
        comment.deleteOne();
    }
}

module.exports = new CommentService();
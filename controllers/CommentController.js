const {validationResult} = require('express-validator');
const ErrorHandler = require('../exceptions/ErrorHandler');
const commentService = require('../services/CommentService');

class CommentController {

    async createComment(request, response, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {content} = request.body;
            const {user} = request;
            const event_id = request.params.event_id;

            const comment = await commentService.create(user.id, event_id, content);

            return response.status(201).json(comment);
        }
        catch(e) {
            next(e);
        }
    }


    async getComments(request, response, next) {
        try {

            const event_id = request.params.event_id;
            const {limit, sort, page} = request.query;

            const categories = await commentService.getByLimitAndSort(event_id, limit, sort, page);

            return response.status(200).json(categories);
        }
        catch(e) {
            next(e);
        }
    }


    async updateComment(request, response, next) {
        try {

            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {content} = request.body;
            const {comment_id} = request.params;

            await commentService.updateById(comment_id, content);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async deleteComment(request, response, next) {
        try {

            const {comment_id} = request.params;
            await commentService.deleteById(comment_id);

            return response.status(204).json();
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = CommentController;
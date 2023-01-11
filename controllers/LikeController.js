const likeService = require('../services/LikeService');

class LikeController {

    async createLike(request, response, next) {
        try {

            const event_id = request.params.event_id;
            const {user} = request;

            await likeService.create(user.id, event_id);

            return response.status(201).json();
        }
        catch(e) {
            next(e);
        }
    }


    async getLike(request, response, next) {
        try {

            const event_id = request.params.event_id;
            const {user} = request;

            const like = await likeService.getByAuthorIdAndEventId(user.id, event_id);

            return response.status(200).json(like);
        }
        catch(e) {
            next(e);
        }
    }


    async deleteLike(request, response, next) {
        try {

            const event_id = request.params.event_id;
            const {user} = request;

            await likeService.deleteByAuthorIdAndEventId(user.id, event_id);

            return response.status(204).json();
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = LikeController;
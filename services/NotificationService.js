const NotificationDto = require('../dtos/NotificationDto');
const ErrorHandler = require('../exceptions/ErrorHandler');
const NotificationModel = require('../models/Notification');

class NotificationService {

    async getNotificationsForUser(id, limit, page) {
        console.log(`Get notifications for user with id ${id} with limit: ${limit}, page: ${page}`);

        if (limit && limit < 0) {
            throw ErrorHandler.BadRequest("Limit should be more than 0");
        }

        if (page && page < 0) {
            throw ErrorHandler.BadRequest('Page should be more than 0');
        }

        if(!limit) {
            limit = 20;
        }

        if(!page) {
            page = 0;
        }

        page++;
        const notifications = await NotificationModel.find({user_id: id})
            .skip(page > 0 ? ((page - 1) * limit) : 0)
            .limit(limit)
            .sort({ date: -1 });

        const notificationsDto = [];
        
        for(var i = 0; notifications[i]; i++) {
            notificationsDto.push(new NotificationDto(notifications[i]));
        }

        return notificationsDto;
    }

}

module.exports = new NotificationService();
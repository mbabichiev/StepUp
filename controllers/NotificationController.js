const notificationService = require("../services/NotificationService");

class NotificationController {

    async getNotifications(request, response, next) {
        try {
            const {user} = request;
            const {limit, page} = request.query;

            const notifications = await notificationService.getNotificationsForUser(user.id, limit, page);
            return response.status(200).json(notifications);
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = NotificationController;
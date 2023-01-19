const UserModel = require('../models/User');
const NotificationModel = require('../models/Notification');

class Notificater {

    // return arr of logins
    static getNotificationsFromText(text) {
        const notifications = text.split('@');
        const result = [];

        for (var i = 1; notifications[i]; i++) {
            const part = notifications[i];

            let indexOf = 0;
            for (var j = 0; part[j]; j++) {

                if (!part[j].match(/[0-9a-zA-Z]/)) {
                    indexOf = j;
                    break;
                }
            }
    
            result.push(part.substr(0, j));
        }
        
        return result;
    }


    static async notificateOtherUsers(text, nameOfNotifications, link) {
        const notifications = this.getNotificationsFromText(text);

        for (var i = 0; notifications[i]; i++) {
            const user_in_notification = await UserModel.findOne({ login: notifications[i] });
            if(!user_in_notification) {
                continue;
            }

            NotificationModel.create({
                user_id: user_in_notification._id,
                content: nameOfNotifications,
                link: link,
                sent_to_telegram: user_in_notification.chat_id ? false : null,
                chat_id: user_in_notification.chat_id
            })
        }
    }

}

module.exports = Notificater;
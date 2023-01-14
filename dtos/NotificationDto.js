module.exports = class NotificationDto {
    
    constructor(model) {
        this.id = model._id;
        this.content = model.content;
        this.link = model.link ? model.link : null;
        this.date = model.date;
    }
}
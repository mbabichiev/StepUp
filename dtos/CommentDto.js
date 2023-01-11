module.exports = class CategoryDto {
    
    constructor(model, user) {
        this.id = model._id;
        this.author = {
            login: user.login,
            firstname: user.firstname,
            lastname: user.lastname
        }
        this.event_id = model.event_id;
        this.content = model.content;
        this.publish_date = model.publish_date;
    }
}
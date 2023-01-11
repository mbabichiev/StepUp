module.exports = class LikeDto {
    
    constructor(model) {
        this.id = model._id;
        this.author_id = model.author_id;
        this.event_id = model.event_id;
    }
}
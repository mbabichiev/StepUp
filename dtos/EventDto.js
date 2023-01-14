module.exports = class EventDto {
    
    constructor(model, user, category) {
        
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.author = {
            login: user.login,
            firstname: user.firstname,
            lastname: user.lastname
        };
        this.location = {
            lat: model.lat,
            lng: model.lng,
            country: model.country,
            city: model.city,
            street: model.street,
            house_number: model.house_number
        };
        this.category = {
            id: model.category_id,
            name: category.name ? category.name : null
        };
        this.people_limit = model.people_limit ? model.people_limit : null;
        this.price = model.price;
        this.likes = model.likes;
        this.active = model.active;
        this.time_start = model.time_start;
        this.time_end = model.time_end;
    }
}
module.exports = class UserDto {
    
    constructor(model) {
        this.id = model._id;
        this.amount = model.amount;
    }
}
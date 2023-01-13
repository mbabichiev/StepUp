module.exports = class UserDto {
    
    constructor(model) {
        this.id = model._id;
        this.login = model.login;
        this.firstname = model.firstname;
        this.lastname = model.lastname;
        this.email = model.email;
        this.role = model.role;
        this.official = model.official;
        this.phone_number = model.phone_number;
        this.description = model.description ? model.description : null;
    }
}
module.exports = class UserLinkDto {
    
    constructor(model) {
        this.login = model.login;
        this.firstname = model.firstname;
        this.lastname = model.lastname;
        this.official = model.official;
    }
}
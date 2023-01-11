module.exports = class CategoryDto {
    
    constructor(model) {
        this.id = model._id;
        this.name = model.name;
    }
}
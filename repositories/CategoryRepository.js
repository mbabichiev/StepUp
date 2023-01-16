const CategoryModel = require('../models/Category');
const ErrorHandler = require('../exceptions/ErrorHandler');


class CategoryRepository {

    async findById(id) {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw ErrorHandler.BadRequest(`Category with id ${id} not found`);
        }
        return category;
    }


    async findByName(name) {
        const category = await CategoryModel.findOne({ name });
        if (!category) {
            throw ErrorHandler.BadRequest(`Category with name '${name}' not found`);
        }
        return category;
    }

}

module.exports = new CategoryRepository();
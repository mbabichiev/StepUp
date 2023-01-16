const CategoryDto = require('../dtos/CategoryDto');
const ErrorHandler = require('../exceptions/ErrorHandler');
const CategoryModel = require('../models/Category');
const categoryRepository = require('../repositories/CategoryRepository');


class CategoryService {


    async create(name) {
        console.log("Create category with name: " + name);

        if (await CategoryModel.findOne({ name })) {
            throw ErrorHandler.BadRequest(`Category with name '${name}' already exists`);
        }

        const category = await CategoryModel.create({
            name: name
        });

        return new CategoryDto(category);
    }


    async getById(id) {
        console.log("Get category with id: " + id);
        const category = await categoryRepository.findById(id);
        return new CategoryDto(category);
    }


    async getByName(name) {
        console.log("Get category with name: " + name);
        const category = await categoryRepository.findByName(name);
        return new CategoryDto(category);
    }


    async getAll() {
        console.log("Get all categories");

        const categories = await CategoryModel.find();
        const categoriesDto = [];

        for(var i = 0; categories[i]; i++) {
            categoriesDto.push(new CategoryDto(categories[i]));
        }
        return categoriesDto;
    }


    async updateById(id, name) {
        console.log("Update category with id: " + id);

        const category = await categoryRepository.findById(id);

        if(name && category.name !== name) {
            if(await CategoryModel.findOne({name})) {
                throw ErrorHandler.BadRequest(`Category with name '${name}' already exists`)
            }
            category.name = name;
        }

        category.save();
    }


    async deleteById(id) {
        console.log("Delete category with id: " + id);
        const category = await categoryRepository.findById(id);
        category.deleteOne();
    }
}


module.exports = new CategoryService();
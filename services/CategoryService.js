const CategoryDto = require('../dtos/CategoryDto');
const ErrorHandler = require('../exeptions/ErrorHandler');
const CategoryModel = require('../models/Category');

class CategoryService {


    async create(name) {
        console.log("Create category with name: " + name);

        if (await CategoryModel.findOne({ name })) {
            throw ErrorHandler.BadRequest(`Category with name '${name}' already exists`);
        }

        const category = await CategoryModel.create({
            name: name
        });

        const categoryDto = new CategoryDto(category);
        return categoryDto;
    }


    async getById(id) {
        console.log("Get category with id: " + id);

        const category = await CategoryModel.findById(id);
        if (!category) {
            throw ErrorHandler.BadRequest("Category with id " + id + " not found");
        }

        const categoryDto = new CategoryDto(category);

        return categoryDto;
    }


    async getByName(name) {
        console.log("Get category with name: " + name);

        const category = await CategoryModel.findOne({ name });
        if (!category) {
            throw ErrorHandler.BadRequest("Category not found");
        }

        const categoryDto = new CategoryDto(category);

        return categoryDto;
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

        const category = await CategoryModel.findById(id);
        if (!category) {
            throw ErrorHandler.BadRequest("Category with id " + id + " not found");
        }

        if(name && category.name !== name) {
            if(await CategoryModel.findOne({name})) {
                throw ErrorHandler.BadRequest(`Category with name '${name}' already exists`)
            }
            category.name = name;
        } 

        await category.save();
    }


    async deleteById(id) {
        console.log("Delete category with id: " + id);

        if (!await CategoryModel.findById(id)) {
            throw ErrorHandler.BadRequest("Category with id " + id + " not found");
        }

        await CategoryModel.findByIdAndDelete(id);
    }
}

module.exports = new CategoryService();
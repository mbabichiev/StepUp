const {validationResult} = require('express-validator');
const ErrorHandler = require('../exceptions/ErrorHandler');
const categoryService = require('../services/CategoryService');

class CategoryController {

    async createCategory(request, response, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {name} = request.body;
            const category = await categoryService.create(name);

            return response.status(201).json(category);
        }
        catch(e) {
            next(e);
        }
    }


    async getCategory(request, response, next) {
        try {

            const id = request.params.id;
            const category = await categoryService.getById(id);

            return response.status(200).json(category);
        }
        catch(e) {
            next(e);
        }
    }


    async getAllCategories(request, response, next) {
        try {
            const categories = await categoryService.getAll();
            return response.status(200).json(categories);
        }
        catch(e) {
            next(e);
        }
    }


    async updateCategory(request, response, next) {
        try {

            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const id = request.params.id;
            const {name} = request.body;
            await categoryService.updateById(id, name);

            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async deleteCategory(request, response, next) {
        try {

            const id = request.params.id;
            await categoryService.deleteById(id);

            return response.status(204).json();
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = CategoryController;
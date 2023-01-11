const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const authMidleware = require('../middlewares/AuthMiddleware');
const { body } = require('express-validator');
const adminMiddleware = require("../middlewares/AdminMiddleware");

const categoryRouter = express.Router();
const categoryController = new CategoryController();


categoryRouter.post("/",
    authMidleware,
    adminMiddleware,
    body('name').isLength({ min: 1, max: 16 }),
    categoryController.createCategory);

categoryRouter.put('/:id',
    authMidleware,
    adminMiddleware,
    body('name')
        .if(body('name').exists())
        .isLength({ min: 1, max: 16 }),
    categoryController.updateCategory);

categoryRouter.get('/:id', categoryController.getCategory);
categoryRouter.get('/', categoryController.getAllCategories);
categoryRouter.delete('/:id', authMidleware, adminMiddleware, categoryController.deleteCategory);


module.exports = categoryRouter;
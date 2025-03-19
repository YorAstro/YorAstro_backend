const BaseController = require('../base/BaseController');
const { Category, Product } = require('../../models');
const { ValidationError } = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');
const ResponseHandler = require('../../utils/responseHandler');

class CategoryController extends BaseController {
    constructor() {
        super(Category);
    }

    async getAll(req, res) {
        try {
            const categories = await this.model.findAll({
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price']
                }]
            });
            return ResponseHandler.success(res, categories);
        } catch (error) {
            logger.error(`Error fetching categories: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch categories', 500);
        }
    }

    async getById(req, res) {
        try {
            const category = await this.model.findByPk(req.params.id, {
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price', 'description']
                }]
            });

            if (!category) {
                return ResponseHandler.error(res, 'Category not found', 404);
            }

            return ResponseHandler.success(res, category);
        } catch (error) {
            logger.error(`Error fetching category: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch category', 500);
        }
    }

    async create(req, res) {
        try {
            const { name, description } = req.body;

            // Check if category with same name exists
            const existingCategory = await this.model.findOne({
                where: { name: { [Op.iLike]: name } }
            });

            if (existingCategory) {
                throw new ValidationError('Category with this name already exists');
            }

            const category = await this.model.create({
                name,
                description
            });

            return ResponseHandler.created(res, category);
        } catch (error) {
            logger.error(`Error creating category: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to create category', 500);
        }
    }

    async update(req, res) {
        try {
            const { name, description } = req.body;
            const category = await this.model.findByPk(req.params.id);

            if (!category) {
                return ResponseHandler.error(res, 'Category not found', 404);
            }

            // Check if new name conflicts with existing category
            if (name && name !== category.name) {
                const existingCategory = await this.model.findOne({
                    where: { 
                        name: { [Op.iLike]: name },
                        id: { [Op.ne]: category.id }
                    }
                });

                if (existingCategory) {
                    throw new ValidationError('Category with this name already exists');
                }
            }

            await category.update({ name, description });
            return ResponseHandler.success(res, category, 'Category updated successfully');
        } catch (error) {
            logger.error(`Error updating category: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to update category', 500);
        }
    }

    async delete(req, res) {
        try {
            const category = await this.model.findByPk(req.params.id);

            if (!category) {
                return ResponseHandler.error(res, 'Category not found', 404);
            }

            // Check if category has products
            const productCount = await Product.count({
                where: { categoryId: category.id }
            });

            if (productCount > 0) {
                throw new ValidationError('Cannot delete category with associated products');
            }

            await category.destroy();
            return ResponseHandler.noContent(res, 'Category deleted successfully');
        } catch (error) {
            logger.error(`Error deleting category: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to delete category', 500);
        }
    }
}

module.exports = new CategoryController(); 
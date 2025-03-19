const BaseController = require('../base/BaseController');
const { Product, Category } = require('../../models');
const { ValidationError } = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');
const ResponseHandler = require('../../utils/responseHandler');

class ProductController extends BaseController {
    constructor() {
        super(Product);
    }

    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, categoryId } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (categoryId) {
                where.categoryId = categoryId;
            }

            const { count, rows } = await this.model.findAndCountAll({
                where,
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return ResponseHandler.paginate(res, rows, page, limit, count);
        } catch (error) {
            logger.error(`Error fetching products: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch products', 500);
        }
    }

    async getById(req, res) {
        try {
            const product = await this.model.findByPk(req.params.id, {
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }]
            });

            if (!product) {
                return ResponseHandler.error(res, 'Product not found', 404);
            }

            return ResponseHandler.success(res, product);
        } catch (error) {
            logger.error(`Error fetching product: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch product', 500);
        }
    }

    async create(req, res) {
        try {
            const { categoryId, ...productData } = req.body;

            // Verify category exists
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    throw new ValidationError('Category not found');
                }
            }

            const product = await this.model.create({
                ...productData,
                categoryId
            });

            return ResponseHandler.created(res, product);
        } catch (error) {
            logger.error(`Error creating product: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to create product', 500);
        }
    }

    async update(req, res) {
        try {
            const { categoryId, ...productData } = req.body;
            const product = await this.model.findByPk(req.params.id);

            if (!product) {
                return ResponseHandler.error(res, 'Product not found', 404);
            }

            // Verify category exists if being updated
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    throw new ValidationError('Category not found');
                }
            }

            await product.update({
                ...productData,
                categoryId
            });

            return ResponseHandler.success(res, product, 'Product updated successfully');
        } catch (error) {
            logger.error(`Error updating product: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to update product', 500);
        }
    }
}

module.exports = new ProductController(); 
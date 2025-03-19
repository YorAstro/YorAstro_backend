const ResponseHandler = require('../../utils/responseHandler');
const { logger } = require('../../utils/logger');

class BaseController {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            return ResponseHandler.success(res, items);
        } catch (error) {
            logger.error(`Error in getAll: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch items', 500);
        }
    }

    async getById(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (!item) {
                return ResponseHandler.error(res, 'Item not found', 404);
            }
            return ResponseHandler.success(res, item);
        } catch (error) {
            logger.error(`Error in getById: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch item', 500);
        }
    }

    async create(req, res) {
        try {
            const item = await this.model.create(req.body);
            return ResponseHandler.created(res, item);
        } catch (error) {
            logger.error(`Error in create: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to create item', 500);
        }
    }

    async update(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (!item) {
                return ResponseHandler.error(res, 'Item not found', 404);
            }
            await item.update(req.body);
            return ResponseHandler.success(res, item);
        } catch (error) {
            logger.error(`Error in update: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to update item', 500);
        }
    }

    async delete(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (!item) {
                return ResponseHandler.error(res, 'Item not found', 404);
            }
            await item.destroy();
            return ResponseHandler.noContent(res);
        } catch (error) {
            logger.error(`Error in delete: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to delete item', 500);
        }
    }
}

module.exports = BaseController; 
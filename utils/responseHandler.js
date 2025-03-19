class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data
        });
    }

    static error(res, message, statusCode = 400) {
        return res.status(statusCode).json({
            status: 'error',
            message
        });
    }

    static paginate(res, data, page, limit, total) {
        return res.status(200).json({
            status: 'success',
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }

    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static noContent(res, message = 'No content') {
        return res.status(204).json({
            status: 'success',
            message
        });
    }
}

module.exports = ResponseHandler; 
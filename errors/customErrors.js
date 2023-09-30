class BaseError extends Error {
    constructor(name, statusCode, message) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

class NotFoundError extends BaseError {
    constructor(message = 'Resource not found') {
        super('NotFoundError', 404, message);
    }
}

class NotAvailableError extends BaseError {
    constructor(message = 'Not Available') {
        super('NotAvailableError', 404, message);
    }
}

class OutOfStockError extends BaseError {
    constructor(message = 'Out of stock') {
        super('OutOfStockError', 400, message);
    }
}

class ValidationError extends BaseError {
    constructor(message = 'Validation failed.') {
        super('ValidationError', 400, message);
    }
}

class BadRequestError extends BaseError {
    constructor(message = 'Bad request') {
        super(BadRequestError, 400, message);
    }
}

class ConflictError extends BaseError {
    constructor(message = 'Conflict detected.') {
        super('ConflictError', 409, message);
    }
}

export { NotFoundError, NotAvailableError, ValidationError, ConflictError, OutOfStockError, BadRequestError };
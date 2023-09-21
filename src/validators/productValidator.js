import { ValidationError } from '../../errors/customErrors.js';

export const validateProduct = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || typeof price !== 'number' || !thumbnail || !code || typeof stock !== 'number') {
        throw new ValidationError('All fields are mandatory!');
    }

    if (price < 0) {
        throw new ValidationError('Price must be a positive value.');
    }

    if (stock < 0) {
        throw new ValidationError('Stock must be a positive value.');
    }

    if (title.length < 3) {
        throw new ValidationError('Product name must be at least 3 characters long.');
    }
};
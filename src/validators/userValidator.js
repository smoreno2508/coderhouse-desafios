import { ValidationError } from '#errors/customErrors.js';

export const validateUser = (firstName, lastName, email, password) => {
    
    if (!firstName || !lastName || !email || !password) {
        throw new ValidationError('All fields are mandatory!');
    }

};
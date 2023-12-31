import { errorResponse } from "#utils/utils.js";
const errorHandler = (err, req, res, next) => {

    err = err || {};
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    errorResponse(res, message, statusCode);
   
};

export default errorHandler;


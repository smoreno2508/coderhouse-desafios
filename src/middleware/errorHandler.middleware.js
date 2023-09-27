const errorHandler = (err, req, res, next) => {

    err = err || {};
    
    const statusCode = err.statusCode || 500;

    let errorResponse = {
        status: statusCode,
        error: 'Internal Server Error'
    }

    if(err.message) errorResponse.error = err.message;
    res.status(statusCode).json(errorResponse);
   
};

export default errorHandler;


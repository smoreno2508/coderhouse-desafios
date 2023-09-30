import { dirname } from 'path';
import { fileURLToPath } from 'url';
const currentDir = dirname(fileURLToPath(import.meta.url))
const __dirname = dirname(currentDir);

const successResponse = (res, message, data = {}, code = 200) =>{
    return res.status(code).json({
        code,
        status: 'success',
        message,
        data
    })
}

const errorResponse = (res, message, code = 400) => {
    return res.status(code).json({
        code,
        status: 'error',
        message
    });
}

export  {
    __dirname,
    successResponse,
    errorResponse
}
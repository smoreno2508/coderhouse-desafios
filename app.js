import express from 'express';
import errorHandler from './src/middleware/errorHandler.middleware.js';
import mainRoutes from './src/routes/index.js';

const app = express();
const PORT = 8080;

export const runApp = async () => {

    try {
        
        app.use(express.json());

        app.use('/', mainRoutes);
        
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`aplicacion corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.log(error.message);
    }

}

runApp();
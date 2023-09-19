import express from 'express';
import errorHandler from './src/middleware/errorHandler.js';
import productRoutes from './src/routes/products.js'

const app = express();
const PORT = 8080;

export const runApp = async () => {

    try {
        app.use(express.json());

        app.use('/', productRoutes);
        
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`aplicacion corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.log(error.message);
    }

}

runApp();
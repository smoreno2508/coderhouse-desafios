import  express  from 'express';
import ProductManager from '../services/ProductManager.js';

const router = express.Router();
const manager = new ProductManager('./data/products.json');


// POST - Agregar un producto
router.post('/products', async (req, res, next) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        await manager.addProduct(title, description, price, thumbnail, code, stock);
        res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
        next(error);
    }
});

// PUT - Actualizar un producto por ID
router.put('/products/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        await manager.updateProductById(id, req.body);
        res.json({ message: `Product with ID ${id} updated successfully!` });
    } catch (error) {
        next(error);
    }
});

// DELETE - Eliminar un producto por ID
router.delete('/products/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        await manager.deleteProductById(id);
        res.json({ message: `Product with ID ${id} deleted successfully!` });
    } catch (error) {
        next(error);
    }
});

//GET - Obtener todos los productos - limitarlos si viene con ?limit=number
router.get('/products', async (req, res, next) => {
    try {
        const products = await manager.getProducts();
        //si se especifica un limite, aplicamos los limites al resultado
        if (req.query.limit) {
            const limit = parseInt(req.query.limit, 10);
            return res.json(products.slice(0, limit));
        }
        // si no hay limite, devolvemos todos los productos
        res.json(products);
    } catch (error) {
        next(error)
    }
});

//GET - Obtener productos por id 

router.get('/products/:pid', async (req, res, next) => {
    try {
        const id = parseInt(req.params.pid, 10);
        const products = await manager.getProductById(id);
        res.json(products);
    } catch (error) {
       next(error);
    }
});

export default router;

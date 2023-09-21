import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

// POST - Agregar un producto
router.post('/products', productController.addProduct);
// PUT - Actualizar un producto por ID
router.put('/products/:id', productController.updateProduct);
// DELETE - Eliminar un producto por ID
router.delete('/products/:id', productController.deleteProduct);
//GET - Obtener todos los productos - limitarlos si viene con ?limit=number
router.get('/products', productController.getProducts);
//GET - Obtener productos por id
router.get('/products/:pid', productController.getProductById);

export default router;

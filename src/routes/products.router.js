import { Router } from 'express';
import * as productController from '#controllers/product.controller.js';

const router = Router();


router.post('/products', productController.addProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products', productController.getProducts);
router.get('/products/:pid', productController.getProductById);

export default router;

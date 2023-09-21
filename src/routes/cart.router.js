import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';

const router = Router();

router.post('/carts/', cartController.addCart);
router.post('/carts/:cid/products/:pid', cartController.addProductToCart);
router.get('/carts/:cid', cartController.getCartById);
router.get('/carts/', cartController.getCarts);
router.delete('/carts/:cid/clear', cartController.clearCart);

export default router;

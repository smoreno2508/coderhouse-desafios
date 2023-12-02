import { Router } from 'express';
import * as cartController from '../controllers/CartController.js';

const router = Router();

router.post('/carts/', cartController.addCart);
router.post('/carts/:cid/products/:pid', cartController.addProductToCart);
router.put('/carts/:cid/products/:pid', cartController.updateQuantity);
router.put('/carts/:cid', cartController.updateCart);
router.get('/carts/:cid', cartController.getCartById);
router.get('/carts/', cartController.getCarts);
router.delete('/carts/:cid/clear', cartController.clearCart);
router.delete('/carts/:cid', cartController.deleteCart);
router.delete('/carts/:cid/products/:pid', cartController.deleteProductFromCart);

export default router;

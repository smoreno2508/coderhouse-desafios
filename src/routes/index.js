import { Router } from "express";
import productRoutes from './products.router.js';
import cartRoutes from './cart.router.js';

const router = Router();

router.use('/', productRoutes);
router.use('/', cartRoutes);

export default router;
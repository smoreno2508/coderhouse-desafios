import { Router } from "express";
import productRoutes from './products.router.js';
import cartRoutes from './cart.router.js';

const router = Router();

router.use('/api/', productRoutes);
router.use('/api/', cartRoutes);

export default router;
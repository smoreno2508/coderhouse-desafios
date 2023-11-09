import { Router } from "express";
import productRoutes from './products.router.js';
import cartRoutes from './cart.router.js';
import sessionRoutes from './session.router.js';
import viewsRoutes from './views.router.js'


const router = Router();

router.use('/api/', productRoutes);
router.use('/api/', cartRoutes);
router.use('/api/', sessionRoutes);
router.use('/', viewsRoutes);

export default router;
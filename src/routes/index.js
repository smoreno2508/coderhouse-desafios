import { Router } from "express";
import productRoutes from './ProductRouter.js';
import cartRoutes from './CartRouter.js';
import sessionRoutes from './SessionRouter.js';
import viewsRoutes from './ViewsRouter.js'


const router = Router();

router.use('/api/', productRoutes);
router.use('/api/', cartRoutes);
router.use('/api/', sessionRoutes);
router.use('/', viewsRoutes);

export default router;
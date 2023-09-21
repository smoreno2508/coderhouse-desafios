import { Router } from "express";
import productRoutes from './products.router.js';

const router = Router();

router.use('/', productRoutes);

export default router;
import { Router } from 'express';
import { productService } from '#services/index.js';

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const productList = await productService.getProducts(limit);
    res.render('home', { productList });
});

router.get("/realtimeproducts",async(req,res)=>{
    res.render("realtimeproducts")
 });


export default router;
import { Router } from 'express';
import { productService } from '#services/index.js';

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const productList = await productService.getProducts(limit);

    const plainProductList = productList.map(product => product.toObject());
    res.render('home', { productList: plainProductList });
});

router.get("/realtimeproducts",async(req,res)=>{
    res.render("realtimeproducts")
 });

 router.get("/chat", async(req,res)=>{
    res.render("chat")
 });


export default router;
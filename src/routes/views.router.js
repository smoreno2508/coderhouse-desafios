import { Router } from 'express';
import { productService, cartService } from '#services/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {

        const { page, limit, sort, ...query } = req.query;


        const productList = await productService.getProducts({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 12,
            sort: sort || { createdAt: -1 }, // ordenamiento por defecto
            query: query || {} // búsqueda por defecto
        });

        let pagination = {
            page: productList.page,
            totalPages: productList.totalPages,
            hasNextPage: productList.hasNextPage,
            nextPage: productList.nextPage,
            hasPrevPage: productList.hasPrevPage,
            prevPage: productList.prevPage,
            pages: [] // Array de números de página para iterar en la vista
        };
        
        for (let i = 1; i <= productList.totalPages; i++) {
            pagination.pages.push(i);
        }

        const productObject = productList.docs.map(doc => doc.toObject());
        
        res.render('home', { productList: productObject, pagination: pagination, sort:sort });
        
    } catch (error) {
        next(error);
    }

});


router.get("/cart/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        const cartObject = cart.toObject();
        const countItems = cart.products.length;
        const total = cart.products.reduce((accumulator, product) => {
            return accumulator + (product.product.price * product.quantity);
        }, 0);
     
        res.render("cart", { cart: cartObject, countItems: countItems, total: total });
    } catch (error) {
        next(error);
    }
});


router.get("/product/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        res.render("product", { product: product.toObject() });
    } catch (error) {
        next(error);
    }
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
});

router.get("/chat", async (req, res) => {
    res.render("chat")
});


export default router;
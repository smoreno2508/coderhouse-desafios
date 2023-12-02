import { Router } from 'express';
import { productService, cartService } from '#services/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { page, limit, sort, ...query } = req.query;

        const productList = await productService.getProducts({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 12,
            sort,
            query
        });

        const pagination = {
            ...productList,
            pages: Array.from({ length: productList.totalPages }, (_, i) => i + 1)
        };
       
        const categories = await productService.getUniqueCategories();

        
        if(req.isAuthenticated()){
            
            res.render('home', { 
                productList: productList.docs.map(doc => doc.toObject()), 
                ...pagination, 
                sort, 
                currentQuery: query,
                categories,
                user: req.user
            });
        } else {
            res.redirect("/login");
        }
        
        
    } catch (error) {
        next(error);
    }
});




router.get("/cart/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
     
        res.render("cart", { 
            cart: cart.toObject(), 
            countItems: cart.products.length, 
        });
        
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

router.get("/login", async (req, res) => {
    const messages = req.flash("error");
    res.render("login", { messages: messages});
})

router.get("/register", async (req, res) => {
    res.render("register");
});

router.get("/noAuthorized", async (req, res) => {
    res.render("noAuthorized");
});

export default router;
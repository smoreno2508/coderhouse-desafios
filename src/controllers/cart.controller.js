import CartService from "#services/CartServices.js";
import ProductServices from "#services/ProductServices.js";

const productService = new ProductServices('./data/products.json');
const cartService = new CartService('./data/cart.json', productService);

const addCart = async (req, res, next) => {
    try {
        const { products } = req.body;
        await cartService.addCart(products);
        res.status(201).json({ message: "Cart created successfully!" });
    } catch (error) {
        next(error);
    }
};

const addProductToCart = async (req, res, next) => {
    try {
        const cid = parseInt(req.params.cid, 10);
        const pid = parseInt(req.params.pid, 10);
        await cartService.addProductToCart(cid, pid);
        res.status(200).json({ message: "Product added successfully!" });
    } catch (error) {
        next(error);
    }
}

const getCartById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.cid, 10);
        const cart = await cartService.getCartById(id);
        res.json(cart);
    } catch (error) {
        next(error);
    }
}

const getCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getCarts();
        res.json(carts);
    } catch (error) {
        next(error);
    }
}

const clearCart = async (req, res, next) => {
    try {
        const cid = parseInt(req.params.cid, 10);
        await cartService.clearCart(cid);
        res.status(200).json({ message: 'Cart cleared successfully!'})
    } catch (error) {
        next(error);
    }
}


export {
    getCarts,
    getCartById,
    addCart,
    addProductToCart,
    clearCart
}
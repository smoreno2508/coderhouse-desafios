import { cartService } from "#services/index.js";
import { successResponse } from "#utils/utils.js";

const addCart = async (req, res, next) => {
    try {
        const { products } = req.body;
        const cart = await cartService.addCart(products);
        successResponse(res, "Cart created successfully.", cart, 201);
    } catch (error) {
        next(error);
    }
};

const addProductToCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.addProductToCart(cid, pid);

        successResponse(res, "Product added to cart successfully.", { cart });
    } catch (error) {
        next(error);
    }
}

const updateCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const products = req.body;
        const cartUpdated = await cartService.updateCart(cid, products);
        successResponse(res, "Cart updated successfully.", { cartUpdated });
    } catch (error) {
        next(error);
    }
}


const updateQuantity = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartService.updateQuantity(cid, pid, quantity);
        successResponse(res, "Cart updated successfully.", { cart });
    } catch (error) {
        next(error);
    }
}

const deleteProductFromCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.removeProductFromCart(cid, pid);
        successResponse(res, "Product deleted from cart successfully.", { cart });
    } catch (error) {
        next(error);
    }
}

const getCartById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        successResponse(res, "Cart retrieved successfully.", { cart });
    } catch (error) {
        next(error);
    }
}

const getCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getCarts();
        successResponse(res, "Carts retrieved successfully.", { carts });
    } catch (error) {
        next(error);
    }
}

const clearCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        await cartService.clearCart(cid);
        successResponse(res, "Cart cleared successfully.");
    } catch (error) {
        next(error);
    }
}

const deleteCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        await cartService.deleteCartById(cid);
        successResponse(res, "Cart deleted successfully.");
    } catch (error) {
        next(error);
    }
}

export {
    getCarts,
    getCartById,
    addCart,
    addProductToCart,
    clearCart,
    deleteCart,
    updateQuantity,
    deleteProductFromCart,
    updateCart
}

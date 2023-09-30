
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
        const cid = parseInt(req.params.cid, 10);
        const pid = parseInt(req.params.pid, 10);
        const cart = await cartService.addProductToCart(cid, pid);
        successResponse(res, "Product added to cart successfully.", { cart });
    } catch (error) {
        next(error);
    }
}

const getCartById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.cid, 10);
        const cart = await cartService.getCartById(id);
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
        const cid = parseInt(req.params.cid, 10);
        await cartService.clearCart(cid);
        successResponse(res, "Cart cleared successfully.");
    } catch (error) {
        next(error);
    }
}

const deleteCart = async (req, res, next) => {
    try {
        const cid = parseInt(req.params.cid, 10);
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
    deleteCart
}

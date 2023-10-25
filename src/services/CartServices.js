import { NotFoundError, NotAvailableError, OutOfStockError, BadRequestError } from '#errors/customErrors.js';
import { Cart } from '#models/Cart.js'

export default class CartService {

    constructor(productService){
        this.productService = productService;
    }

    async addCart() {
        const newCart = new Cart();
        await newCart.save();
        return newCart;
    }

    async getCarts() {
        
        const carts = await Cart.find();

        if (carts.length === 0) throw new NotAvailableError('No carts available.');
    
        return carts;
    }

    async getCartById(id) {
        const cart = await Cart.findById(id);
        if (!cart) {
            throw new NotFoundError(`Cart with ID ${id} not found!`);
        }
        return cart;
    }

    async addProductToCart(cartId, productId) {
        
        const product = await this.productService.getProductById(productId); 
        const cart = await this.getCartById(cartId);

        if (product.stock === 0) throw new OutOfStockError(`Product with ID ${productId} is out of stock. Cannot add to cart.`);

        const productInCart = cart.products.find(p => p.product._id.equals(productId));
       
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.productService.updateProductStock(productId, -1);
        await cart.save();
        return cart;
    }

    async deleteCartById(id) {
        const cart = await Cart.findByIdAndRemove(id);
        if (!cart) throw new NotFoundError(`Cart with ID ${id} does not exist!`);
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        cart.products = [];
        await cart.save();
    }

}
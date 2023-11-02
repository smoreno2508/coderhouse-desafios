import { NotFoundError, NotAvailableError, OutOfStockError, BadRequestError } from '#errors/customErrors.js';
import { Cart } from '#models/Cart.js'

export default class CartService {

    constructor(productService) {
        this.productService = productService;
    }

    async addCart() {
        const newCart = new Cart();
        await newCart.save();
        return newCart;
    }

    async getCarts() {

        const carts = await Cart.find()
            .populate('products.product', ["title", "price", "code"]);

        if (carts.length === 0) throw new NotAvailableError('No carts available.');

        return carts;
    }

    async getCartById(id) {
        const cart = await Cart.findById(id)
            .populate('products.product');

        if (!cart) {
            throw new NotFoundError(`Cart with ID ${id} not found!`);
        }
        return cart;
    }


    async updateCart(cartId, productsToAdd) {
        
        const cart = await Cart.findById(cartId);
    
        if (!cart) throw new NotFoundError(`Cart with ID ${cartId} not found.`);
    
        for (let productData of productsToAdd) {
            const productId = productData.product; 
            const product = await this.productService.getProductById(productId);
    
            if (product.stock < productData.quantity) throw new OutOfStockError(`Not enough stock for product ID ${productId}.`);
    
            const existingProductInCart = cart.products.find(p => p.product.toString() === productId);
    
            if (existingProductInCart) {
                // Incrementa la cantidad si el producto ya está en el carrito
                existingProductInCart.quantity += productData.quantity;
            } else {
                // Añade el producto y su cantidad al carrito
                cart.products.push({ product: productId, quantity: productData.quantity });
            }
    
            // Actualiza el stock del producto
            await this.productService.updateProductStock(productId, - productData.quantity);
        }
    
        await cart.save();
        return cart;
    }
    
    


    async updateQuantity(cartId, productId, newQuantity) {
        if (newQuantity < 1) throw new BadRequestError('Quantity must be greater than 0.');

        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) throw new NotFoundError(`Cart with ID ${cartId} not found.`);

        const productEntry = cart.products.find(p => p.product.equals(productId));
        if (!productEntry) throw new NotFoundError(`Product with ID ${productId} not found in cart.`);

        const currentQuantity = productEntry.quantity;
        const quantityDifference = newQuantity - currentQuantity;

        const product = await this.productService.getProductById(productId);
        if (!product) throw new NotFoundError(`Product with ID ${productId} not found.`);

        if (product.stock < quantityDifference) throw new OutOfStockError(`Not enough stock for product ID ${productId}.`);

        productEntry.quantity = newQuantity;
        await cart.save();

        // Actualiza el stock del producto
        await this.productService.updateProductStock(productId, -quantityDifference);

        return cart;
    }

    async addProductToCart(cartId, productId) {

        const product = await this.productService.getProductById(productId);
        const cart = await Cart.findById(cartId);

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

    async removeProductFromCart(cartId, productId) {

        const cart = await Cart.findById(cartId);

        if (!cart) throw new NotFoundError(`Cart with ID ${cartId} not found.`);

        const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));

        if (productIndex === -1) throw new NotFoundError(`Product with ID ${productId} not found in cart.`);

        const removedProduct = cart.products[productIndex];
        await this.productService.updateProductStock(productId, removedProduct.quantity);

        cart.products.splice(productIndex, 1);

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
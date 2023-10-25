import { readFile, writeFile } from '#utils/fileHelper.js';
import { NotFoundError, NotAvailableError, OutOfStockError, BadRequestError } from '#errors/customErrors.js';
import CartModel from "../FileModels/CartModel.js";

export default class CartManager {
    constructor(path, productManager) {
        this.path = path;
        this.productManager = productManager;
        this.cart = [];
        this.iniatilizeCarts();
    }

    async iniatilizeCarts() {
        this.cart = await readFile(this.path);
    }

    async saveCart() {
        await writeFile(this.path, this.cart);
    }

    findCartIndexById(id) {
        return this.cart.findIndex(cart => cart.id === id);
    }

    async addCart() {

        const id = (!this.cart.length) ? 1 : this.cart[this.cart.length - 1].id + 1;
        const newCart = new CartModel(id);

        this.cart.push(newCart);
        await this.saveCart();

        return newCart;
    }

    async getCarts() {

        if (this.cart.length === 0) {
            throw new NotAvailableError('No carts available.');
        }

        return this.cart;
    }

    async getCartById(id) {

        if (isNaN(id)) throw new BadRequestError("Cart ID must be a number.");

        const cart = this.cart.find(cart => cart.id === id);
        if (!cart) {
            throw new NotFoundError(`Cart with ID ${id} not found!`);
        }
        return cart;
    }

    async addProductToCart(cartId, productId) {

        if (isNaN(cartId) || isNaN(productId)) throw new BadRequestError('ID must be a number.');

        const product = await this.productManager.getProductById(productId);
        const cart = await this.getCartById(cartId);

        if (product.stock === 0) throw new OutOfStockError(`Product with ID ${productId} is out of stock. Cannot add to cart.`);

        const productInCart = cart.products.find(p => p.product === productId);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.productManager.updateProductStock(productId, -1);
        await this.saveCart();

        return cart;
    }

    async deleteCartById(id) {

        if (isNaN(id)) throw new BadRequestError("Cart ID must be a number.");

        const index = this.findCartIndexById(id);

        if (index === -1) throw new NotFoundError(`Cart with ID ${id} does not exist!`);

        this.cart.splice(index, 1);
        await this.saveCart();
    }

    async clearCart(cid) {

        if (isNaN(cid)) throw new BadRequestError("Cart ID must be a number.");

        const cart = await this.getCartById(cid);

        if (!cart) throw new NotFoundError(`Cart with ID ${cid} does not exist!`)

        cart.products = [];
        await this.saveCart();
    }

}
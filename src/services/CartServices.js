import { readFile, writeFile } from '../utils/fileHelper.js';
import { NotFoundError, NotAvailableError, OutOfStockError } from '../../errors/customErrors.js';
import Cart from "../models/Cart.js";

export default class CartService {
    constructor(path, productManager) {
        this.path = path;
        this.cart = readFile(this.path);
        this.productManager = productManager;
    }

    async saveCart() {
        writeFile(this.path, this.cart);
    }

    async addCart() {
        const id = (!this.cart.length) ? 1 : this.cart[this.cart.length - 1].id + 1;
        const newCart = new Cart(id);
        this.cart.push(newCart);
        await this.saveCart();
    }

    async getCarts() {
        if (this.cart.length === 0) {
            throw new NotAvailableError('No carts available.');
        }
        return this.cart;
    }

    async getCartById(id) {
        const cart = this.cart.find(cart => cart.id === id);
        if (!cart) {
            throw new NotFoundError(`Cart with ID ${id} not found!`);
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        const product = await this.productManager.getProductById(pid);
        const cart = await this.getCartById(cid);

        if (!product) {
            throw new NotFoundError(`Product with ID ${pid} does not exist. Cannot add to cart.`)
        }

        if (product && product.stock === 0) {
            throw new OutOfStockError(`Product with ID ${pid} is out of stock. Cannot add to cart.`)
        }

        if (!cart) {
            throw new NotFoundError(`Cart with ID ${cid} does not exist!`)
        }

        const productIndex = cart.products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
            await this.productManager.updateProductStock(pid, -1);
        } else {
            cart.products.push({ product: pid, quantity: 1 });
            await this.productManager.updateProductStock(pid, -1);
        }

        await this.saveCart();
    }

    async clearCart(cid) {
        const cart = await this.getCartById(cid);
        if (!cart) {
            throw new NotFoundError(`Cart with ID ${cid} does not exist!`)
        }
        cart.products = [];
        await this.saveCart();
    }

}
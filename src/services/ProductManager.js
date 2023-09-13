import { readFile, writeFile } from '../utils/fileHelper.js';
import { validateProduct } from '../validators/productValidator.js';
import Product from '../models/Product.js';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = readFile(this.path);
    }

    saveProducts() {
        writeFile(this.path, this.products);
    }

    productExists(code) {
        return this.products.find(producto => producto.code === code);
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const id = (!this.products.length) ? 1 : this.products[this.products.length - 1].id + 1;
        const nuevoProducto = new Product(id, title, description, price, thumbnail, code, stock);

        if (this.productExists(code)) {
            throw new Error(`El producto con el codigo ${code} ya existe!`);
        }
        validateProduct(title, description, price, thumbnail, code, stock);
        this.products.push(nuevoProducto);
        this.saveProducts();
    }

    async deleteProductById(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error('Not found');
        }
        this.products.splice(index, 1);
        this.saveProducts();
        console.log(`Product with ID ${id} deleted successfully!!`);
    }

    async updateProductById(id, updates) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        Object.assign(product, updates);
        this.saveProducts();
        console.log(`Product with ID ${id} update successfully!!`);
    }


    async getProducts() {
        if (this.products.length === 0) {
            throw new Error('No products available.');
        }
        return this.products;
    }

    async getProductById(id) {
        const producto = this.products.find(producto => producto.id === id);
        if (!producto) {
            throw new Error(`Product with ID ${id} not found!`);
        }
        return producto;
    }

}
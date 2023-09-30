import { readFile, writeFile } from '#utils/fileHelper.js';
import { validateProduct } from '#validators/productValidator.js';
import { NotFoundError, NotAvailableError, ConflictError, BadRequestError } from '#errors/customErrors.js';
import Product from '#models/Product.js';

export default class ProductService {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.iniatilizeProducts();
    }

    async iniatilizeProducts() {
        this.products = await readFile(this.path);
    }

    async saveProducts() {
        await writeFile(this.path, this.products);
    }

    productExists(code) {
        return this.products.find(product => product.code === code);
    }

    findProductIndexById(id) {
        return this.products.findIndex(product => product.id === id);
    }

    async addProduct(title, status, category, description, price, thumbnail, code, stock) {
        const id = (!this.products.length) ? 1 : this.products[this.products.length - 1].id + 1;
        const newProduct = new Product(id, title, status, category, description, price, thumbnail, code, stock);
        
        if (this.productExists(code)) {
            throw new ConflictError(`Product with the code ${code} already exists!`);
        }
        validateProduct(title, category, description, price, thumbnail, code, stock);
        this.products.push(newProduct);
        await this.saveProducts();

        return newProduct;
    }

    async deleteProductById(id) {

        if (isNaN(id)) throw new BadRequestError("Product ID must be a number.");

        const index = this.findProductIndexById(id);
        if (index === -1) {
            throw new NotFoundError(`Product with ID ${id} not found for delete.`);
        }
        this.products.splice(index, 1);
        await this.saveProducts();
    }

    async updateProductById(id, updates) {

        if (isNaN(id)) throw new BadRequestError("Product ID must be a number.");

        const productIndex = this.findProductIndexById(id);
        if (productIndex === -1) {
            throw new NotFoundError(`Product with ID ${id} not found for update.`);
        }
        Object.assign(this.products[productIndex], updates);
        await this.saveProducts();
    }

    async getProducts(limit) {
        if (this.products.length === 0) {
            throw new NotAvailableError('No products available.');
        }
        
        if (limit) {
            if (isNaN(limit) || limit <= 0) {
                throw new BadRequestError("Limit must be a positive number.");
            }
            return this.products.slice(0, limit);
        }

        return this.products;
    }

    async getProductById(id) {

        if (isNaN(id)) throw new BadRequestError("Product ID must be a number.");
        
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundError(`Product with ID ${id} not found!`);
        }
        return product;
    }

    async updateProductStock(id, quantity) {
        const product = await this.getProductById(id);
        product.stock += quantity;
        await this.saveProducts();
    }

}
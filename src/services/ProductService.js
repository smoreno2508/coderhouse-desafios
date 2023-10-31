import mongoose from 'mongoose';
import { validateProduct } from '#validators/productValidator.js';
import { NotFoundError, NotAvailableError, ConflictError, BadRequestError } from '#errors/customErrors.js';
import { Product } from '../models/Product.js';

export default class ProductService {

    async productExists(code) {
        return await Product.findOne({ code: code })
    }

    async addProduct(title, status, category, description, price, thumbnail, code, stock) {

        if (await this.productExists(code)) throw new ConflictError(`Product with the code ${code} already exists!`);

        validateProduct(title, category, description, price, thumbnail, code, stock);

        const newProduct = new Product({ title, status, category, description, price, thumbnail, code, stock });

        await newProduct.save();

        return newProduct;
    }

    async deleteProductById(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Product ID is not valid.");
        }
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            throw new NotFoundError(`Product with ID ${id} not found.`);
        }
    }

    async updateProductById(id, updates) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Product ID is not valid.");
        }

        const result = await Product.updateOne({ _id: id }, updates);
        if (result.matchedCount === 0) throw new NotFoundError(`Product with ID ${id} not found for update.`)

    }

    async getProducts({ limit = 12, page = 1, sort = {}, query = {} } = {}) {

        const sortOptions = {
            "asc": { price: 1 },
            "desc": { price: -1 },
            "default": { createdAt: -1}
        }

        const sortOrder = sortOptions[sort] || sortOptions["default"];
        
        const options = {
            page: page,
            limit: limit,
            sort: sortOrder
        } 

        const products = await Product.paginate(query, options);

        if (!products.docs.length) throw new NotAvailableError('No products available.');

        return products;
    }


    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Product ID is not valid.");
        }

        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError(`Product with ID ${id} not found!`);
        }
        return product;
    }

    async updateProductStock(id, quantity) {
        const product = await this.getProductById(id);
        if (!product) throw new NotFoundError(`Product with ID ${id} not found!`);
        if (quantity < 0 && product.stock < Math.abs(quantity)) throw new BadRequestError(`Cannot reduce stock by ${Math.abs(quantity)} as there are only ${product.stock} items in stock.`);
        product.stock += quantity;
        await product.save();
    }


}
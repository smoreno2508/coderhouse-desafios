import mongoose from 'mongoose';
import { validateProduct } from '#validators/productValidator.js';
import { NotFoundError, NotAvailableError, ConflictError, BadRequestError } from '#errors/customErrors.js';
import { Product } from '../models/Product.js';




export default class ProductService {

    /**
     * ? should we use this auxiliar function out of the class?
    */

    validateObjetId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Product ID is not valid.");
        }
    }


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

        this.validateObjetId(id);
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            throw new NotFoundError(`Product with ID ${id} not found.`);
        }
    }

    /**
     * ? should validate the update before updating?
     */
    async updateProductById(id, updates) {

        this.validateObjetId(id);

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) throw new NotFoundError(`Product with ID ${id} not found for update.`);

        return updatedProduct;

    }

    async getProducts({ limit = 12, page = 1, sort = {}, query = {} } = {}) {

        const sortOptions = {
            "asc": { price: 1 },
            "desc": { price: -1 },
            "default": { createdAt: -1 }
        }

        const sortOrder = sortOptions[sort] || sortOptions["default"];

        const options = {
            page,
            limit,
            sort: sortOrder
        }

        const products = await Product.paginate(query, options);

        if (!products.docs.length) throw new NotAvailableError('No products available.');

        return products;
    }


    async getUniqueCategories() {
        const categories = await Product.distinct('category');
        return categories;
    }


    async getProductById(id) {

        this.validateObjetId(id);

        const product = await Product.findById(id);
        if (!product) throw new NotFoundError(`Product with ID ${id} not found!`);

        return product;
    }



    async updateProductStock(id, quantity) {

        this.validateObjetId(id);
        const product = await this.getProductById(id);

        const updateResult = await Product.updateOne(
            { _id: id, stock: { $gte: -quantity } },
            { $inc: { stock: quantity } }
        );

        if (updateResult.nModified === 0) {
            throw new BadRequestError(`Cannot reduce stock by ${Math.abs(quantity)} as there are only ${product.stock} items in stock.`);
        }
    }


}
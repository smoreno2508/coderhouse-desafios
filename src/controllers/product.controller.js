import { productService } from '#services/index.js';
import { successResponse } from '#utils/utils.js';

// POST - Add a product
const addProduct = async (req, res, next) => {
    try {
        const { title, status, category, description, price, thumbnail, code, stock } = req.body;
        const productAdded = await productService.addProduct(title, status, category, description, price, thumbnail, code, stock);
        successResponse(res, "Product added successfully.", { productAdded }, 201);
    } catch (error) {
        next(error);
    }
};

// PUT - Update a product by ID
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.updateProductById(id, req.body);
        successResponse(res, `Product with ID ${id} updated successfully.`);
    } catch (error) {
        next(error);
    }
}

// DELETE - Delete a product by ID
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProductById(id);
        successResponse(res, `Product with ID ${id} deleted successfully.`);
    } catch (error) {
        next(error);
    }
}

// GET - Retrieve all products - limited if ?limit=number is specified
const getProducts = async (req, res, next) => {
    try {
        const { page, limit, sort, ...otherQuery } = req.query;

        const parsedPage = page ? parseInt(page, 10) : undefined;
        const parsedLimit = limit ? parseInt(limit, 10) : undefined;

        const products = await productService.getProducts({
            page: parsedPage,
            limit: parsedLimit,
            sort,
            query: otherQuery // Cambiando 'query' a 'otherQuery'
        });

        successResponse(res, "Products retrieved successfully.", { products });
    } catch (error) {
        next(error)
    }
}


// GET - Retrieve a product by ID
const getProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        successResponse(res, `Product with ID ${pid} retrieved successfully.`, { product });
    } catch (error) {
        next(error);
    }
}

export {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById
}

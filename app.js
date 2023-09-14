import express from 'express';
import ProductManager from "./src/services/ProductManager.js";

const app = express();
const PORT = 8080;

export const runApp = async () => {

    try {
        const manager = new ProductManager('./data/products.json');

        app.use(express.json());

        // POST - Agregar un producto
        app.post('/products', async (req, res) => {
            try {
                const { title, description, price, thumbnail, code, stock } = req.body;
                await manager.addProduct(title, description, price, thumbnail, code, stock);
                res.status(201).json({ message: "Product added successfully!" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // PUT - Actualizar un producto por ID
        app.put('/products/:id', async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                await manager.updateProductById(id, req.body);
                res.json({ message: `Product with ID ${id} updated successfully!` });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // DELETE - Eliminar un producto por ID
        app.delete('/products/:id', async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                await manager.deleteProductById(id);
                res.json({ message: `Product with ID ${id} deleted successfully!` });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        //GET - Obtener todos los productos - limitarlos si viene con ?limit=number
        app.get('/products', async (req, res) => {
            try {
                const products = await manager.getProducts();
                //si se especifica un limite, aplicamos los limites al resultado
                if (req.query.limit) {
                    const limit = parseInt(req.query.limit, 10);
                    return res.json(products.slice(0, limit));
                }
                // si no hay limite, devolvemos todos los productos
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        //GET - Obtener productos por id 

        app.get('/products/:pid', async (req, res) => {
            try {
                const id = parseInt(req.params.pid, 10);
                const products = await manager.getProductById(id);
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.listen(PORT, () => {
            console.log(`aplicacion corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.log(error.message);
    }

}

runApp();
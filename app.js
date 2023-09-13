import ProductManager from "./src/services/ProductManager.js";

export const runApp = async () => {
    try {
        const manager = new ProductManager('./data/products.json');

        /**
        * agregamos productos
        */

        //await manager.addProduct('Iphone 15 pro max', 'Iphone', 2200, 'sin imagen', 'APPL15', 50);
        // await manager.addProduct('Samsung galaxy s24 Ultra', 'Smartphone Samsung', 2200, 'sin imagen', 'SMG24', 80);

        const products = await manager.getProducts();
        console.log(products);

        /**
         * Eliminamos productos
         */

        // await manager.deleteProductById(6);

        /**
         * Actualizamos productos
         */
        
        // await manager.updateProductById(5,{ title: 'OLED Monitor HDR10+'});

         
        /**
         * Mostramos productos por ID
         */
        // const productById = await manager.getProductById(5);
        // console.log(productById);
    } catch (error) {
        console.log(error.message);
    }
}

runApp();
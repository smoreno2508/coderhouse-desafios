import ProductService from "#services/ProductService.js";
import CartServices from "#services/CartServices.js"


const productService = new ProductService('./data/products.json');
const cartService = new CartServices('./data/cart.json', productService);

export { productService, cartService };
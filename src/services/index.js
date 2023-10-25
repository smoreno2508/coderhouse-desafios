import ProductService from "#services/ProductService.js";
import CartServices from "#services/CartServices.js"
import MessageService from "#services/MessageService.js";


const productService = new ProductService();
const cartService = new CartServices(productService);
const messageService = new MessageService();

export { productService, cartService, messageService };
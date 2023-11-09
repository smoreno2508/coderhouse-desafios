import ProductService from "#services/ProductService.js";
import CartServices from "#services/CartServices.js"
import MessageService from "#services/MessageService.js";
import UserService from "#services/UserService.js";


const productService = new ProductService();
const cartService = new CartServices(productService);
const messageService = new MessageService();
const userService = new UserService();

export { productService, cartService, messageService, userService };
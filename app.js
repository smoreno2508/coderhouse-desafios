import Server from "#config/Server.js";
import { productService, messageService } from "#services/index.js"

const server = new Server(productService, messageService);
server.start();
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import errorHandler from '#middlewares/errorHandler.middleware.js';
import mainRoutes from '#routes/index.js';
import dbConnection from './Database.js';
import { __dirname } from '#utils/utils.js';

import SocketManager from '#sockets/SocketManager.js';

config();
class Server {
    constructor(productService, messageService) {
        this.app = express();
        this.productService = productService;
        this.messageService = messageService;
        this.config();
        this.connectDB();
        this.middlewares();
        this.handlebars();
        this.routes();
        this.errorHandler();
    }

    config(){
        this.PORT = process.env.PORT;
    }
    
    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname + "/public"));
    }


    handlebars(){
        this.app.engine('handlebars', engine({
            helpers: {
                eq: (v1, v2) => v1 == v2 ,
                multiply: (v1, v2) => v1 * v2,
                calculateTotal: (products) => products.reduce((acc, product) => acc + (product.product.price * product.quantity), 0)
            },
            partialsDir: __dirname + '/views/partials',
        }));
        
        this.app.set('views', __dirname + '/views');
        this.app.set('view engine', 'handlebars');
    }

    routes(){
        this.app.use('/', mainRoutes);
    }

    errorHandler(){
        this.app.use(errorHandler);
    }
   
    start() {
        this.httpServer = this.app.listen(this.PORT, () => {
            console.log(`Application running on http://localhost:${this.PORT}`);
        });

        this.io = new SocketIOServer(this.httpServer);
        new SocketManager(this.io, this.productService, this.messageService);
    }
}

export default Server;

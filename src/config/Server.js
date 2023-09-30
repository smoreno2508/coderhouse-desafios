import express from 'express';
import { Server as SocketIOServer } from "socket.io";
import { engine } from 'express-handlebars';
import errorHandler from '#middlewares/errorHandler.middleware.js';
import mainRoutes from '#routes/index.js';
import { productService } from '#services/index.js';
import { __dirname } from '#utils/utils.js';

import SocketManager from '#sockets/SocketManager.js';

class Server {
    constructor() {
        this.app = express();
        this.config();
        this.middlewares();
        this.handlebars();
        this.routes();
        this.errorHandler();
    }

    config(){
        this.PORT = 8080;
    }

    middlewares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname + "/public"));
    }

    handlebars(){
        this.app.engine('handlebars', engine());
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
        new SocketManager(this.io, productService);
    }
}

export default Server;

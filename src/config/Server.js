import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './Passport.js';
import flash from 'connect-flash';

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
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(session({
            store: new MongoStore({ mongoUrl: process.env.MONGODB_ATLAS}),
            secret: process.env.SESSION_SECRET,
            cookie: { maxAge: 120000 },
            resave: false,
            saveUninitialized: false,
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
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

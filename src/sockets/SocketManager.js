export default class SocketManager {
    constructor(io, productService, messageService) {
        this.io = io;
        this.productService = productService;
        this.messageService = messageService;
        this.initializeSockets();
    }

    async initializeSockets() {
        this.io.on("connection", async (socket) => {

            console.log(`Client connected with ID: ${socket.id}`);

            // products
            const products = await this.productService.getProducts();

            socket.emit('products', products);

            socket.on('addProduct', async (...data) => {
                try {
                    await this.productService.addProduct(...data);
                    const updatedProducts = await this.productService.getProducts();
                    socket.broadcast.emit('productAddedNotification', 'New product added!!');
                    this.io.emit('productsUpdated', updatedProducts);
                } catch (error) {
                    console.log(error.message);
                    socket.emit('productsError', error.message);
                }
            });

            socket.on('deleteProduct', async (id) => {
                try {
                    await this.productService.deleteProductById(id);
                    const updatedProducts = await this.productService.getProducts();  
                    socket.broadcast.emit('productAddedNotification', `Product with ID ${id} deleted.`);
                    this.io.emit('productsUpdated', updatedProducts); 
                } catch (error) {
                    console.log(error.message);
                    socket.emit('productsError', error.message);
                }
            });

            //TODO modularizar socket por servicios
             
            socket.on('new user', (username) => {
                socket.username = username;
            })

            socket.on('send message', async (data) => {
                const savedMessage = await this.messageService.addMessage(data.username, data.message)
                this.io.emit('new message', savedMessage);
            })

            socket.on('disconnect', () => {
                console.log(`Client with ID: ${socket.id} disconnected.`);
            });
        })

    }
}
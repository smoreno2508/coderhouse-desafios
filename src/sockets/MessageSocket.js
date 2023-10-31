class MessageSocket {
    constructor(io, messageService) {
        this.io = io;
        this.messageService = messageService;
    }

    async registerEvents(socket) {
        // Message events here
        socket.on('new user', (username) => {
            socket.username = username;
        });

        socket.on('send message', async (data) => {
            const savedMessage = await this.messageService.addMessage(data.username, data.message);
            this.io.emit('new message', savedMessage);
        });
    }
}

export default MessageSocket;

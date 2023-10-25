import mongoose from "mongoose";

import { Message } from "../models/Message.js";

export default class MessageService {

    async addMessage(user, message){
        const newMessage = new Message({ user, message });
        await newMessage.save();
        return newMessage;
    }

    async getRecentMessages(limit = 20){
        return await Message.find()
        .sort('-timestamp')
        .limit(limit)
    }
}
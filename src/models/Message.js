import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    user: String,
    message: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export const Message = model('messages', MessageSchema);
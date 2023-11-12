import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    isGithub: {
        type:Boolean,
        default:false,
    },
});


export const User = model('user', usersSchema);
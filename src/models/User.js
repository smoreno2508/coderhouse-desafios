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
    age: {
        type:Number,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    cartId:{
        type:Schema.Types.ObjectId,
        ref:'carts'
    },
    role: {
        type:String,
        required:true,
        enum:['admin','user'],
        default:'user',
    },
    isGithub: {
        type:Boolean,
        default:false,
    },
});


export const User = model('user', usersSchema);
import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: {
        type:String,
        required: [true, 'Title is required.']
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    category: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    thumbnail: {
        type:String,
        required:true,
    },
    code: {
        type:String,
        required:true,
        unique:true,
    },
    stock: {
        type:Number,
        required:true,
    }
});


productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function () {
    const { __v,...product} = this.toObject();
    return product;
}

export const Product = model('products', productSchema);


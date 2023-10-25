import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        _id: false
    }]
});

cartSchema.methods.toJSON = function () {
    const { __v,...cart} = this.toObject();
    return cart;
}

export const Cart = model('carts', cartSchema);
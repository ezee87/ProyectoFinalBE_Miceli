import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  products: [
      {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
          quantity: { type: Number, default: 1 },
      },
  ],
});

CartSchema.pre('find', function() {
  this.populate('products.product');
});


export const CartModel = mongoose.model( 'carts', CartSchema);
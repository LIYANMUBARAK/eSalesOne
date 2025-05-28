import mongoose from "mongoose";
const Schema = mongoose.Schema;


const variantSchema = new Schema({
  name: { type: String, required: true },
  options: [{ type: String, required: true }]
}, { _id: false });

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // prevents duplicate names
  },
  description:{
    type: String,
    required:true,

  },
  price: {
    type: Number,
    required: true,
    min: 0 // disallow negative prices
  },
  variant: {
    type: [variantSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const product = mongoose.model('Product', productSchema)

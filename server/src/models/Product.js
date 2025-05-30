import mongoose from "mongoose";
const Schema = mongoose.Schema;

const optionsSchema = new Schema({
  model: String, price : Number, stock: Number
})

const variantSchema = new Schema({
  name: { type: String, required: true },
  options:[optionsSchema]
}, { _id: false });

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // prevents duplicate names
  },
  product_id: {
    type: String,
    required: true
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
  color: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const product = mongoose.model('Product', productSchema)

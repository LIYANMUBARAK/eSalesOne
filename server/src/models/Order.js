import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: [
    {
      product_id: String,
      name: String,
      price: Number,
      quantity: Number,
      selectedVariants: Object,
      selectedColor: String,
      totalPrice: Number,
    },
  ],
  customer: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  payment: {
    card: String,
    expiryDate: String,
  },
  subtotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  shipping: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const order = mongoose.model('Order', orderSchema);

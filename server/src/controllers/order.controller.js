import { product } from '../models/Product.js';
import { order } from '../models/Order.js';

import { v4 as uuidv4 } from 'uuid';


const createOrder = async (request, response, next) => {
  try {
    const { customer, payment, items, subtotal, shipping, total } = request.body;
    console.log(request.body);
    const cardNumber = payment.cardNumber;

    if (cardNumber === '2') {
      // Declined transaction
      return response.status(402).json({
        success: false,
        message: 'Transaction declined by payment gateway',
      });
    } else if (cardNumber === '3') {
      // Gateway error
      return response.status(500).json({
        success: false,
        message: 'Payment gateway error. Please try again later.',
      });
    } else {
      const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

      for (const item of items) {
        const dbProduct = await product.findOne({ product_id: item.product_id });

        if (!dbProduct) {
          return response
            .status(404)
            .json({ success: false, message: `Product not found: ${item.name}` });
        }

        // If product has variants, reduce stock on selected variant option(s)
        if (item.selectedVariants ) {
          for (const [variantName, selectedOption] of Object.entries(item.selectedVariants)) {
            // Find the variant group (e.g. "Size")
            console.log("variantName",variantName) 
            console.log("selectedOption",selectedOption)
            const variantGroup = dbProduct.variant.find((v) => v.name === variantName);
            console.log("variantGroup",variantGroup)
            if (!variantGroup) {
              return response
                .status(400)
                .json({ success: false, message: `Variant not found: ${variantName}` });
            }

            // Find the option inside that variant (e.g. model "M")
            const option = variantGroup.options.find((o) => o.model === selectedOption);
            console.log(option)
            if (!option) {
              return response
                .status(400)
                .json({
                  success: false,
                  message: `Variant option not found: ${selectedOption} in ${variantName}`,
                });
            }

            // Check stock
            if (option.stock < item.quantity) {
              return response
                .status(400)
                .json({
                  success: false,
                  message: `Insufficient stock for variant option: ${selectedOption} in ${variantName}`,
                });
            }

            // Reduce stock
            option.stock -= item.quantity;
          }
        } else {
          // No variants selected, reduce product stock directly
          if (dbProduct.stock < item.quantity) {
            return response
              .status(400)
              .json({ success: false, message: `Insufficient stock for: ${item.name}` });
          }
          dbProduct.stock -= item.quantity;
        }

console.log("DB PRODUCT :", JSON.stringify(dbProduct, null, 2));
        await dbProduct.save();
      }


          // Save order to DB
    const newOrder = new order({
      orderNumber,
      items,
      customer,
      payment: {
        card: payment.cardNumber,
        expiryDate: payment.expiryDate,
      },
      total,
      subtotal,
      shipping
    });

    await newOrder.save();

    return response.status(200).json({
      success: true,
      message: 'Transaction approved',
      order: {
        orderNumber,
        customer,
        items,
        subtotal,
        shipping,
        total,
      },
    });

    }
  } catch (error) {
    console.error('Order creation error:', error);
    return response.status(500).json({
      success: false,
      message: 'Server error while processing order.',
    });
  }
};

export { createOrder };

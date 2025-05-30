import { product } from '../models/Product.js';
import { order } from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import transport from '../mailer/transporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createOrder = async (request, response, next) => {
  try {
    const { customer, payment, items, subtotal, shipping, total } = request.body;
    console.log(request.body);
    const cardNumber = payment.cardNumber;

    if (cardNumber === '2') {
      // Declined transaction
      sendOrderFailed(customer.email, customer.fullName, 'Payment Declined');
      return response.status(402).json({
        success: false,
        message: 'Transaction declined by payment gateway',
      });
    } else if (cardNumber === '3') {
      // Gateway error
      sendOrderFailed(customer.email, customer.fullName, 'Payment Gateway Issue.');

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
        if (item.selectedVariants) {
          for (const [variantName, selectedOption] of Object.entries(item.selectedVariants)) {
            // Find the variant group (e.g. "Size")
            console.log('variantName', variantName);
            console.log('selectedOption', selectedOption);
            const variantGroup = dbProduct.variant.find((v) => v.name === variantName);
            console.log('variantGroup', variantGroup);
            if (!variantGroup) {
              return response
                .status(400)
                .json({ success: false, message: `Variant not found: ${variantName}` });
            }

            // Find the option inside that variant (e.g. model "M")
            const option = variantGroup.options.find((o) => o.model === selectedOption);
            console.log(option);
            if (!option) {
              return response.status(400).json({
                success: false,
                message: `Variant option not found: ${selectedOption} in ${variantName}`,
              });
            }

            // Check stock
            if (option.stock < item.quantity) {
              return response.status(400).json({
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

        console.log('DB PRODUCT :', JSON.stringify(dbProduct, null, 2));
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
        shipping,
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

const getOrderByOrderId = async (request, response, next) => {
  try {
    const { id } = request.params;
    console.log(id);
    const orderDetails = await order.findOne({ orderNumber: id });
    console.log(orderDetails);

    if (!orderDetails) {
      return response.status(404).json({
        success: false,
        message: 'Order details not found',
        order: order,
      });
    } else {
      sendConfirmationMail(orderDetails);
      return response.status(200).json({
        success: true,
        message: 'Order details found',
        order: orderDetails,
      });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return response.status(500).json({
      success: false,
      message: 'An error occurred while processing the transaction.',
      error: error.message,
    });
  }
};

async function sendConfirmationMail(orderDetails) {
  const to = orderDetails.customer.email;
  const subject = `Order Confirmation : ${orderDetails.orderNumber}`;
  console.log('to email ', to);

  const templatePath = path.join(__dirname, '../templates', 'orderConfirmation.html');
  const source = await fs.readFile(templatePath, 'utf-8');

  const insecureHandlebars = allowInsecurePrototypeAccess(handlebars);
  const template = insecureHandlebars.compile(source);
  const html = template({
    customerName: orderDetails.customer.name,
    orderNumber: orderDetails.orderNumber,
    items: orderDetails.items,
    total: orderDetails.total,
  });

  const info = await transport.sendMail({
    from: `"Tech Store" <noreply@techStore.com>`,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);
}

export async function sendOrderFailed(to, customerName, issue) {
  const subject = `Order Failed : Tech Store`;

  const templatePath = path.join(__dirname, '../templates', 'orderFailed.html');
  const source = await fs.readFile(templatePath, 'utf-8');
  const handlebarsInstance = allowInsecurePrototypeAccess(handlebars);
  const template = handlebarsInstance.compile(source);

  const html = template({
    customerName: customerName,
    issue: issue,
  });

  const info = await transport.sendMail({
    from: `"Tech Store" <noreply@techstore.com>`,
    to,
    subject,
    html,
  });

  console.log('❌ Order Failed Email sent: %s', info.messageId);
}

export { createOrder, getOrderByOrderId };

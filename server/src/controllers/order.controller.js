


const createOrder = async (request, response, next) => {
  try {
    const { customer, payment, items, subtotal, shipping, total } = request.body;
    console.log(request.body)
    const cardNumber = payment.cardNumber;

    if (cardNumber === '1') {
      // Approved transaction
      return response.status(200).json({
        success: true,
        message: 'Transaction approved',
        order: {
          customer,
          items,
          subtotal,
          shipping,
          total,
        },
      });
    } else if (cardNumber === '2') {
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
      // Default case: Approve all other card numbers
      return response.status(200).json({
        success: true,
        message: 'Transaction approved',
        order: {
          customer,
          items,
          subtotal,
          shipping,
          total,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export {createOrder};
// import { request, response, next } from 'express';
import { product } from '../models/Product.js';

const getAllProducts = async (request, response, next) => {
  try {
    const allProducts = await product.find();
    response.status(200).json({
      success: true,
      data: allProducts,
      message: 'All products fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (request, response, next) => {
  const { id } = request.params;
  console.log(id)
  try {
    const productDetails = await product.findOne({ product_id: id });
    response.status(200).json({
      success: true,
      data: productDetails,
      message: 'Product fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { getAllProducts, getProductById };

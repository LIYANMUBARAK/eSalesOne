import { Router } from 'express';
import { createOrder, getOrderByOrderId } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/createOrder', createOrder);
orderRouter.get('/getOrderByOrderId/:id', getOrderByOrderId);

export default orderRouter;

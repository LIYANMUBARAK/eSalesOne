import {Router} from 'express'
import { getAllProducts } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.get('/getAllProducts',getAllProducts)


export default productRouter
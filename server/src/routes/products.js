import {Router} from 'express'
import { getAllProducts, getProductById } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.get('/getAllProducts',getAllProducts)
productRouter.get('/getProductById/:id',getProductById)

export default productRouter
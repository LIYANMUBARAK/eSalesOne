import {request,response} from 'express'
import { product } from '../models/Product.js'


  const getAllProducts = async(request,response)=>{
    try {
         const allProducts = await product.find()
        console.log(allProducts)
    } catch (error) {
        
    }
   
}

export {getAllProducts}
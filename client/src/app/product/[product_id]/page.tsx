'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';

interface VariantOption {
  name: string;
  model: string;
  price: number;
  stock: number;
  color?: string;
}

interface ProductVariant {
  name: string;
  options: VariantOption[];
}

interface Product {
  _id: string;
  product_id: string;
  name: string;
  description: string;
  price: number;
  variant: ProductVariant[];
  color: string[];
  createdAt?: Date;
}

const API_BASE_URL = 'http://localhost:8000';

function getProductImage(productName: string): string {
  const imageMap: { [key: string]: string } = {
    'MacBook Pro 16"':
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'iPhone 14 Pro':
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    'AirPods Pro':
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=600&fit=crop',
  };
  return (
    imageMap[productName] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.product_id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}/product/getProductById/${productId}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setProduct(result.data);
          
          // Pre-select first options
          const firstVariants: { [key: string]: string } = {};
          result.data.variant.forEach((variant: ProductVariant) => {
            if (variant.options && variant.options.length > 0) {
              firstVariants[variant.name] = variant.options[0].name || variant.options[0].model;
            }
          });
          setSelectedVariants(firstVariants);
          
          // Pre-select first color
          if (result.data.color && result.data.color.length > 0) {
            setSelectedColor(result.data.color[0]);
          }
          
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Calculate total price when variants, color, or quantity changes
  useEffect(() => {
    if (product) {
      let basePrice = product.price;
      
      // Find selected variant option and use its price
      Object.entries(selectedVariants).forEach(([variantName, optionIdentifier]) => {
        const variant = product.variant.find((v) => v.name === variantName);
        if (variant) {
          const option = variant.options.find((o) => 
            (o.name && o.name === optionIdentifier) || o.model === optionIdentifier
          );
          if (option && option.price) {
            basePrice = option.price;
          }
        }
      });

      setTotalPrice(basePrice * quantity);
    }
  }, [selectedVariants, selectedColor, quantity, product]);

  const handleVariantSelect = (variantName: string, optionIdentifier: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: optionIdentifier,
    }));
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    
    // Get stock from selected variant option
    let maxStock = 10; // default
    if (product) {
      Object.entries(selectedVariants).forEach(([variantName, optionIdentifier]) => {
        const variant = product.variant.find((v) => v.name === variantName);
        if (variant) {
          const option = variant.options.find((o) => 
            (o.name && o.name === optionIdentifier) || o.model === optionIdentifier
          );
          if (option && option.stock) {
            maxStock = option.stock;
          }
        }
      });
    }
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    const cartItem = {
      product_id: product.product_id,
      name: product.name,
      price: totalPrice / quantity, // unit price
      quantity,
      selectedVariants,
      selectedColor,
      totalPrice,
      image: getProductImage(product.name),
    };

    // Store as temporary checkout item
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkoutItems', JSON.stringify([cartItem]));
    }
    router.push('/checkout');
  };

  const getSelectedVariantStock = () => {
    if (!product) return 10;
    
    let stock = 10;
    Object.entries(selectedVariants).forEach(([variantName, optionIdentifier]) => {
      const variant = product.variant.find((v) => v.name === variantName);
      if (variant) {
        const option = variant.options.find((o) => 
          (o.name && o.name === optionIdentifier) || o.model === optionIdentifier
        );
        if (option && option.stock) {
          stock = option.stock;
        }
      }
    });
    return stock;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/product" className="text-gray-900 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-white shadow-lg">
              <Image
                src={getProductImage(product.name)}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail images */}
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={`thumbnail-${i}`}
                  className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-md cursor-pointer hover:opacity-80"
                >
                  <Image
                    src={getProductImage(product.name)}
                    alt={`${product.name} thumbnail ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900">{product.name}</h2>

            {/* Star Rating */}
            <div className="flex items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, idx) => (
                <Star key={`star-${idx}`} className="h-5 w-5 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(125 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600">
              ₹{(totalPrice ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>

            {/* Description */}
            <p className="text-gray-700">{product.description}</p>
            
            {/* Colors */}
            {product.color && product.color.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                <div className="flex space-x-3">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Variants (Storage, etc.) */}
            {product.variant && product.variant.length > 0 && (
              <div className="space-y-4">
                {product.variant.map((variant) => (
                  <div key={variant.name} className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">{variant.name}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {variant.options.map((option, optionIndex) => {
                        const optionId = option.name || option.model;
                        const isSelected = selectedVariants[variant.name] === optionId;
                        const optionKey = `${variant.name}-${optionId || `option-${optionIndex}`}`;
                        
                        return (
                          <button
                            key={optionKey}
                            type="button"
                            onClick={() => handleVariantSelect(variant.name, optionId)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                          >
                            <div className="font-medium">{optionId}</div>
                            <div className="text-sm opacity-75">
                              ₹{(option.price ).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs opacity-60">
                              Stock: {option.stock}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold w-12  text-gray-500 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= getSelectedVariantStock()}
                  className="p-2 rounded-md  bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                (Max: {getSelectedVariantStock()})
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Buy Now - ₹{(totalPrice ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </button>

            </div>

            {/* Product Info Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">Selected Configuration:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Color:</span> {selectedColor}</p>
                {Object.entries(selectedVariants).map(([variantName, optionId]) => (
                  <p key={variantName}>
                    <span className="font-medium">{variantName}:</span> {optionId}
                  </p>
                ))}
                <p><span className="font-medium">Quantity:</span> {quantity}</p>
                <p className="font-semibold text-blue-600 pt-1">
                  Total: ₹{(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
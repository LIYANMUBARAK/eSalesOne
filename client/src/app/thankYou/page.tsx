'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, Package, ArrowRight, Star } from 'lucide-react'
import { useRouter } from 'next/navigation';




export default function ThankYouPage() {
        const router = useRouter()

  const [orderNumber, setOrderNumber] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate getting order number from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const order = urlParams.get('orderNumber') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrderNumber(order)
    
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const features = [
    { icon: Package, text: "Fast shipping within 2-3 business days" },
    { icon: CheckCircle, text: "Order confirmation sent to your email" },
    { icon: Star, text: "Track your package in real-time" }
  ]

  function handleContinueShopping(){
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your purchase has been completed successfully
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Order Number
                </p>
                <p className="text-2xl font-bold text-gray-900 font-mono">
                  {orderNumber}
                </p>
              </div>
              <div className="text-indigo-500">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl bg-gray-50 transition-all duration-500 hover:bg-gray-100 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150 + 300}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleContinueShopping} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Track Your Order
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button onClick={handleContinueShopping} className="flex-1 bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105">
              Continue Shopping
              
            </button>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-500">
              Questions about your order? 
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>
    </div>
  )
}
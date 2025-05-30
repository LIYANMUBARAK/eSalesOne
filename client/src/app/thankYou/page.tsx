'use client';
import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Star,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Truck,
  Phone,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null) as any;
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null) as any;

  // Helper functions for data formatting
  function formatCurrency(amount: any) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  function formatDate(dateString: any) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function parseCustomerData(customer: any) {
    if (typeof customer === 'string') {
      try {
        return JSON.parse(customer);
      } catch {
        return null;
      }
    }
    return customer;
  }

  function parseItemsData(items: any) {
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch {
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
  }

  function parsePaymentData(payment: any) {
    if (typeof payment === 'string') {
      try {
        return JSON.parse(payment);
      } catch {
        return null;
      }
    }
    return payment;
  }

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderNumber') || urlParams.get('id');

        if (!orderId) {
          setError('Order ID not found in URL parameters');
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/getOrderByOrderId/${orderId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        if (!data.success) {
          throw new Error(data.message || 'Order not found');
        }

        setOrderData(data.order);
        setIsLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      } catch (error: any) {
        console.error('Error fetching order data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const features = [
    { icon: Package, text: 'Fast shipping within 2-3 business days' },
    { icon: CheckCircle, text: 'Order confirmation sent to your email' },
    { icon: Star, text: 'Track your package in real-time' },
  ];

  function handleContinueShopping() {
    router.push('/');
  }

  function handleTrackOrder() {}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Return to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">No order data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase
            {orderData.customer_name ? `, ${orderData.customer_name}` : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {orderData.createdAt
                      ? formatDate(orderData.createdAt)
                      : new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Order/Product ID
                    </p>
                    <p className="text-xl font-bold text-gray-900 font-mono">
                      {orderData.orderNumber || orderData.product_id || orderData._id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Status: {orderData.status || 'Processing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Information Display */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>

                {/* Order Items */}
                {orderData.items && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Items Ordered</h4>
                    {parseItemsData(orderData.items).map((item: any, index: any) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">{item.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">
                              Product ID: {item.product_id}
                            </p>

                            {/* Variants */}
                            {item.selectedVariants && typeof item.selectedVariants === 'object' && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(item.selectedVariants).map(([key, value]: any) => (
                                  <span
                                    key={key}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            {item.totalPrice && (
                              <p className="text-sm font-medium text-indigo-600">
                                Total: {formatCurrency(item.totalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customer Information */}
                {orderData.customer && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Customer Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {(() => {
                        const customer = parseCustomerData(orderData.customer);
                        if (!customer) return <p className="text-gray-700">{orderData.customer}</p>;

                        return (
                          <div className="space-y-3">
                            {customer.fullName && (
                              <div className="flex items-center space-x-3">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{customer.fullName}</span>
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{customer.phone}</span>
                              </div>
                            )}
                            {(customer.address || customer.city) && (
                              <div className="flex items-start space-x-3 mt-3">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div className="text-gray-700">
                                  {customer.address && <p>{customer.address}</p>}
                                  {customer.city && (
                                    <p>
                                      {customer.city}
                                      {customer.state && `, ${customer.state}`} {customer.zip}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                {orderData.payment && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Payment Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {(() => {
                        const payment = parsePaymentData(orderData.payment);
                        if (!payment) return <p className="text-gray-700">{orderData.payment}</p>;

                        return (
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">
                              Card ending in ****{payment.card}
                              {payment.expiryDate && (
                                <span className="ml-2 text-sm text-gray-500">
                                  Expires {payment.expiryDate}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Additional Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderData.orderNumber && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-500 mb-1">Order Number</p>
                      <p className="text-gray-900 font-mono">{orderData.orderNumber}</p>
                    </div>
                  )}

                  {orderData.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-500 mb-1">Order Date</p>
                      <p className="text-gray-900">{formatDate(orderData.createdAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legacy Customer Information (for backward compatibility) */}
            {(orderData.customer_name || orderData.customer_email || orderData.customer_phone) &&
              !orderData.customer && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Customer Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Contact Details</h3>
                      <div className="space-y-3">
                        {orderData.customer_name && (
                          <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{orderData.customer_name}</span>
                          </div>
                        )}
                        {orderData.customer_email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{orderData.customer_email}</span>
                          </div>
                        )}
                        {orderData.customer_phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{orderData.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {orderData.shipping_address && (
                        <>
                          <h3 className="font-semibold text-gray-900 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Shipping Address
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700">{orderData.shipping_address}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Price Information */}
            {(orderData.total_amount ||
              orderData.amount ||
              orderData.price ||
              orderData.subtotal ||
              orderData.total) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3">
                  {orderData.subtotal && (
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>{formatCurrency(orderData.subtotal)}</span>
                    </div>
                  )}
                  {orderData.tax && (
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span>{formatCurrency(orderData.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {orderData.shipping_cost
                        ? formatCurrency(orderData.shipping_cost)
                        : orderData.shipping === 0
                        ? 'Free'
                        : orderData.shipping
                        ? formatCurrency(orderData.shipping)
                        : 'Free'}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        {formatCurrency(
                          orderData.total ||
                            orderData.total_amount ||
                            orderData.amount ||
                            orderData.price ||
                            orderData.subtotal ||
                            0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h2>

              <div className="space-y-4 mb-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-3 rounded-xl bg-gray-50 transition-all duration-500 hover:bg-gray-100 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTrackOrder}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Track Your Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Questions about your order?
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

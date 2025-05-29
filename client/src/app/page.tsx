// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

const API_BASE_URL = 'http://localhost:8000';

async function getProducts() {
  try {
    console.log('Fetching from:', 'http://localhost:8000');

    const response = await fetch('http://localhost:8000/product/getAllProducts', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const res = await response.json();
    const products = res.data || [];
    return products;
  } catch (error) {
    console.error('API fetch failed:', error);
  }
}

function getProductImage(productName: string): string {
  const imageMap: { [key: string]: string } = {
    'MacBook Pro 16"':
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop',
    'iPhone 14 Pro':
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop',
    'AirPods Pro':
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=400&fit=crop',
  };

  return imageMap[productName];
}

function formatVariantsForDisplay(variants: any[]): { name: string }[] {
  if (!variants || !Array.isArray(variants)) return [];

  const displayVariants: { name: string }[] = [];

  variants.forEach((variant) => {
    if (variant.options && Array.isArray(variant.options)) {
      variant.options.slice(0, 4).forEach((option: any) => {
        displayVariants.push({ name: option.name });
      });
    }
  });

  return displayVariants.slice(0, 4);
}

export default async function HomePage() {
  // Always ensure products is an array
  let products = (await getProducts()) as [];
    console.log(products)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/product" className="text-gray-500 hover:text-blue-600 transition-colors">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Tech Products
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Explore our curated collection of cutting-edge technology products designed to enhance
              your digital lifestyle.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our most popular tech products with multiple variants to
              choose from.
            </p>
          </div>

          {/* Show API connection status in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm"></div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Please check your API connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => {
                const displayVariants = formatVariantsForDisplay(product.variant);

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={getProductImage(product.name)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {product.description}
                      </p>

                      {/* Variants */}
                      {displayVariants.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Available Options:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {displayVariants.map((variant, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                              >
                                {variant.name}
                              </span>
                            ))}
                            {product.variant &&
                              product.variant.reduce(
                                (total: number, v: any) => total + (v.options?.length || 0),
                                0
                              ) > 4 && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  +
                                  {product.variant.reduce(
                                    (total: number, v: any) => total + (v.options?.length || 0),
                                    0
                                  ) - 4}{' '}
                                  more
                                </span>
                              )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500 ml-1">starting from</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          href={`/product/${product.product_id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Upgrade Your Tech?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their technology needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Browse All Products
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">TechStore</h4>
              <p className="text-gray-600 text-s">
                Your trusted partner for premium technology products and exceptional customer
                service.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Products</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Smartphones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

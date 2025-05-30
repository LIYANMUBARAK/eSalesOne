// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cta from '@/components/CTA';
import Hero from '@/components/Hero';

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getAllProducts`, {
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
  let products = (await getProducts()) as [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            </div>
            <Navbar />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our most popular tech products with multiple variants to
              choose from.
            </p>
          </div>

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
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}

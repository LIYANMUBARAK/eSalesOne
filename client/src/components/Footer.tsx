'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">TechStore</h4>
            <p className="text-gray-600 text-s">
              Your trusted partner for premium technology products and exceptional customer service.
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
  );
}

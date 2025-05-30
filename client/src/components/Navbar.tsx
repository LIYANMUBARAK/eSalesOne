'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="hidden md:flex space-x-8 p-4 bg-white ">
      <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors">
        Home
      </Link>
      <Link href="/#products" className="text-gray-500 hover:text-blue-600 transition-colors">
        Products
      </Link>
    </nav>
  );
}

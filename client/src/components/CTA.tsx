'use client';

export default function Cta() {
  return (
    <section id="cta" className="bg-gray-900 text-white py-16">
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
  );
}

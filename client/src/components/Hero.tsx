'use client';

export default function Hero() {
  return (
    <section
      id="heroSection"
      className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20"
    >
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
  );
}

import { useState, useRef } from "react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const productContainerRef = useRef<HTMLDivElement>(null);

  const slides = [
    "Slide 1 Content",
    "Slide 2 Content",
    "Slide 3 Content",
    "Slide 4 Content",
  ];

  const products = [
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$15" },
    { id: 3, name: "Product 3", price: "$20" },
    { id: 4, name: "Product 4", price: "$25" },
    { id: 5, name: "Product 5", price: "$30" },
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollProducts = (direction: "left" | "right") => {
    if (productContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      productContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Carousel Slider */}
      <div className="relative w-full max-w-4xl mx-auto mb-8">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full flex items-center justify-center bg-blue-200 h-64 text-xl font-bold text-gray-700"
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &lt;
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>

      {/* Product Box */}
      <div className="relative w-full max-w-4xl mx-auto">
        <div
          ref={productContainerRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-48 bg-white shadow rounded p-4 text-center"
            >
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-500">{product.price}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Buy Now
              </button>
            </div>
          ))}
        </div>
        {/* Scroll Buttons */}
        <button
          onClick={() => scrollProducts("left")}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &lt;
        </button>
        <button
          onClick={() => scrollProducts("right")}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;

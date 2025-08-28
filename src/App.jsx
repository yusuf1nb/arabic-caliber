import React, { useState, useEffect } from "react";

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [hasSunroof, setHasSunroof] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "+966 ",
    email: "",
    instagram: "@",
    carYear: "",
    carModel: "",
    sunroof: "",
    electricSunroof: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    if (!email.includes("@")) {
      return { isValid: false, message: "Email must contain @ symbol" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      message: isValid
        ? ""
        : "Please enter a valid email address (example@domain.com)",
    };
  };

  const validatePhone = (phone) => {
    // Remove +966 prefix and spaces to validate the remaining digits
    const cleanPhone = phone.replace(/^\+966\s*/, "").replace(/\s+/g, "");
    const phoneRegex = /^[5-9][0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
  };

  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (
      !formData.phone.trim() ||
      formData.phone.trim() === "+966" ||
      formData.phone.trim() === "+966 "
    ) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone =
        "Please enter a valid 9-digit Saudi mobile number (5XXXXXXXX)";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }

    if (!formData.carYear) {
      errors.carYear = "Car year is required";
    } else if (formData.carYear < 1990 || formData.carYear > 2025) {
      errors.carYear = "Car year must be between 1990 and 2025";
    }

    if (!formData.carModel.trim()) {
      errors.carModel = "Car model is required";
    }

    if (!formData.sunroof) {
      errors.sunroof = "Please select if your car has a sunroof";
    }

    if (formData.sunroof === "yes" && !formData.electricSunroof) {
      errors.electricSunroof = "Please specify if the sunroof is electric";
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePhoneChange = (value) => {
    // Ensure the +966 prefix is always present
    if (!value.startsWith("+966 ")) {
      if (value.startsWith("+966")) {
        value = "+966 " + value.substring(4);
      } else {
        value = "+966 " + value.replace(/^\+966\s*/, "");
      }
    }

    // Extract only the digits after +966 and limit to 9 digits
    const digitsOnly = value.replace(/^\+966\s*/, "").replace(/\D/g, "");
    const limitedDigits = digitsOnly.substring(0, 9);

    // Reconstruct the phone number with +966 prefix
    const formattedValue = "+966 " + limitedDigits;

    handleInputChange("phone", formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Form is valid, proceed with submission
    alert("Thank you! We will contact you shortly with your quote.");
    setShowForm(false);
    setHasSunroof("");
    setFormData({
      name: "",
      phone: "+966 ",
      email: "",
      instagram: "",
      carYear: "",
      carModel: "",
      sunroof: "",
      electricSunroof: "",
    });
    setFormErrors({});
  };

  const closeForm = () => {
    setShowForm(false);
    setHasSunroof("");
    setFormData({
      name: "",
      phone: "+966 ",
      email: "",
      instagram: "",
      carYear: "",
      carModel: "",
      sunroof: "",
      electricSunroof: "",
    });
    setFormErrors({});
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate background gradient based on scroll - much darker footer
  const getBackgroundStyle = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / totalHeight, 1);

    // Consistent gradient colors matching CSS
    const darkBlue = `#000425`; // Deep dark blue
    const brightBlue = `#062a8c`; // Brighter blue

    // Simple progression using the same gradient
    if (scrollProgress < 0.5) {
      // Gradient from dark to bright and back to dark
      return {
        background: `linear-gradient(135deg, ${darkBlue} 30%, ${brightBlue} 50%, ${darkBlue} 100%)`,
        transition: "background 0.3s ease-out",
        minHeight: "100vh",
      };
    } else {
      // Keep same gradient at footer
      return {
        background: `linear-gradient(135deg, ${darkBlue} 10%, ${brightBlue} 50%, ${darkBlue} 100%)`,
        transition: "background 0.3s ease-out",
        minHeight: "100vh",
      };
    }
  };

  return (
    <div
      className="min-h-screen text-white relative w-full"
      style={{
        ...getBackgroundStyle(),
        position: "relative",
        zIndex: 1,
      }}>
      {/* Stars Background - Fixed */}
      <div className="fixed inset-0 starry-night opacity-80 pointer-events-none z-0"></div>
      {/* Palm trees silhouette - Background left side */}
      <img
        src="/palm.png"
        alt="Palm trees silhouette"
        className="fixed bottom-[-40px] -left-10 pointer-events-none z-2"
        style={{
          height: "clamp(10vh, 400vw, 70vh)",
          width: "auto",
          maxWidth: "40vw",
          objectFit: "cover",
          objectPosition: "bottom",
          display: "block",
        }}
      />
      {/* Cheetah silhouette - Background right side */}
      <img
        src="/cheetah_shifted.png"
        alt="Cheetah silhouette"
        className="fixed bottom-0 right-0 pointer-events-none z-2"
        style={{
          height: "clamp(20vh, 100vw, 100vh)",
          width: "auto",
          maxWidth: "70vw",
          objectFit: "cover",
          objectPosition: "bottom",
          transform: "translateX(10%)",
          display: "block",
        }}
      />
      {/* Twinkling Stars - Fixed to cover entire page */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
        <div className="twinkling-star"></div>
      </div>

      {/* Header/Hero Section */}
      <header className="relative min-h-screen flex justify-center items-center section-padding">
        {/* Logo and Title */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Arabic Caliber Logo */}
          <div className="">
            <img
              src="/Arabic caliber.png"
              alt="Arabic Caliber Logo"
              className="w-full max-w-lg mx-auto h-auto object-contain"
              style={{
                filter: "drop-shadow(0 0 0 transparent)",
                imageRendering: "crisp-edges",
              }}
            />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium Car Star Lights Installation
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center mb-24 sm:mb-32">
            <button
              className="btn-primary text-lg"
              onClick={() => {
                const packagesSection =
                  document.getElementById("packages-section");
                packagesSection?.scrollIntoView({ behavior: "smooth" });
              }}>
              View Services
            </button>
          </div>
        </div>
      </header>

      {/* Product Quality Section */}
      <section className="relative py-20 section-padding z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">
            Premium Star Light Technology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Quality Point 1 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-3">
                Premium Fiber Optics
              </h3>
              <p className="text-gray-300">
                Highest-grade fiber optic cables for unmatched brightness and clarity, giving your headliner a natural, star-filled glow.
              </p>
            </div>

            {/* Quality Point 2 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-3">
                Advanced LED Technology
              </h3>
              <p className="text-gray-300">
                4 Different LED sizes, giving you a realistic starry night with multiple sizes of stars. Powered by cutting-edge LEDs, our starlights shine brighter, last longer, and offer endless color options for the perfect atmosphere.
              </p>
            </div>

            {/* Quality Point 3 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">
                Professional Installation
              </h3>
              <p className="text-gray-300">
                Our skilled team ensures a seamless, factory-like finish — no shortcuts, no loose ends, just perfection in every detail.
              </p>
            </div>

            {/* Quality Point 4 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">🎛️</div>
              <h3 className="text-xl font-semibold mb-3">Smart Controls</h3>
              <p className="text-gray-300">
                Take control of your galaxy with ease — adjust colors, brightness, and effects directly from your phone or remote.
              </p>
            </div>

            {/* Quality Point 5 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3">Premium VIP Car Care Packages</h3>
              <p className="text-gray-300">
                We stand behind our work. Your starlight headliner is protected by custom warranty plans, giving you peace of mind and lasting confidence.
              </p>
            </div>

            {/* Quality Point 6 */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-primary text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-3">Custom Patterns</h3>
              <p className="text-gray-300">
                Personalize your headliner with custom designs that match your style and make your car truly one-of-a-kind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="packages-section"
        className="py-20 section-padding relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">
            Our Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 500-Star Package */}
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-2 border-transparent hover:border-primary">
              <div className="text-center mb-6">
                <div className="text-primary text-4xl mb-4">⭐</div>
                <h3 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-1">
                  500
                </h3>
                <h4 className="text-xl font-semibold text-white mb-4">
                  500-Star Package
                </h4>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                Subtle Elegance, Perfect for Any Car. Our 500-star package creates a beautifully spaced starlight effect that transforms any sedan, coupe, or SUV into a personal night sky. With the same premium fiber optics and advanced LEDs, you'll enjoy a clean, elegant galaxy effect that enhances your ride with style and class.
              </p>
              <button
                className="w-full btn-primary"
                onClick={() => {
                  setSelectedPackage("500-Star Package - 500 SAR");
                  setShowForm(true);
                }}>
                Choose 500-Star
              </button>
            </div>

            {/* 1000-Star Package */}
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-2 border-primary transform lg:scale-105">
              <div className="text-center mb-6">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
                  MOST POPULAR
                </div>
                <div className="text-primary text-4xl mb-4">✨</div>
                <h3 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-1">
                  1000
                </h3>
                <h4 className="text-xl font-semibold text-white mb-4">
                  1000-Star Package
                </h4>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                A Denser Galaxy, Ideal for Sedans & SUVs. Double the stars, double the magic. The 1000-star package delivers a richer, denser starlight experience — perfect for sedans and most SUVs. This package surrounds you with a fuller starry night feel while keeping the same premium quality, smart controls, and immersive lighting features.
              </p>
              <button
                className="w-full btn-primary"
                onClick={() => {
                  setSelectedPackage("1000-Star Package - 1000 SAR");
                  setShowForm(true);
                }}>
                Choose 1000-Star
              </button>
            </div>

            {/* 1500-Star Package */}
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-2 border-transparent hover:border-primary">
              <div className="text-center mb-6">
                <div className="text-primary text-4xl mb-4">🌟</div>
                <h3 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-1">
                  1500
                </h3>
                <h4 className="text-xl font-semibold text-white mb-4">
                  1500-Star Package
                </h4>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                The Ultimate Night Sky for Larger Rides. Our 1500-star package is designed for medium to large SUVs, creating the most breathtaking, fully packed galaxy effect possible. With thousands of twinkling fiber optics of varying sizes, this package gives you the most realistic starlight experience.
              </p>
              <button
                className="w-full btn-primary"
                onClick={() => {
                  setSelectedPackage("1500-Star Package - 1500 SAR");
                  setShowForm(true);
                }}>
                Choose 1500-Star
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 section-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Why Choose Arabic Caliber?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            With years of experience and a passion for perfection, we deliver
            exceptional car star light installations that transform your
            vehicle's interior. Our attention to detail and commitment to
            quality sets us apart in the automotive customization industry.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-primary text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                High-grade fiber optics and LED systems
              </p>
            </div>

            <div className="text-center">
              <div className="text-primary text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-gray-400">
                Efficient installation without compromising quality
              </p>
            </div>

            <div className="text-center">
              <div className="text-primary text-5xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">
                Satisfaction Guaranteed
              </h3>
              <p className="text-gray-400">
                100% satisfaction or money back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 section-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Ready to transform your car with stunning star lights? Contact us
            today!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                📞 Call Us
              </h3>
              <p className="text-gray-300 text-lg mb-2">+966 50 123 4567</p>
              <p className="text-gray-400">Available 7 days a week</p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                📧 Email Us
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                info@arabiccaliber.com
              </p>
              <p className="text-gray-400">Quick response guaranteed</p>
            </div>
          </div>

          <button
            className="btn-primary text-xl px-8 py-4"
            onClick={() => {
              const packagesSection =
                document.getElementById("packages-section");
              packagesSection?.scrollIntoView({ behavior: "smooth" });
            }}>
            GET A QUOTE
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 section-padding relative z-10 border-t border-gray-700/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Arabic Caliber. All rights reserved. | Premium Car Star Light
            Installation
          </p>
        </div>
      </footer>

      {/* Quote Request Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">
                Get Your Quote
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-primary/20 rounded-lg">
              <p className="text-sm text-gray-300">Selected Package:</p>
              <p className="font-semibold text-primary">{selectedPackage}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none text-white ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none text-white ${
                    formErrors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="+966 5XXXXXXXX"
                  maxLength={14}
                />
                {formErrors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none text-white ${
                    formErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-primary focus:outline-none text-white"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Car Year *
                </label>
                <input
                  type="number"
                  value={formData.carYear}
                  onChange={(e) => handleInputChange("carYear", e.target.value)}
                  min="1990"
                  max="2025"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none text-white ${
                    formErrors.carYear
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="2023"
                />
                {formErrors.carYear && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.carYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Car Model *
                </label>
                <input
                  type="text"
                  value={formData.carModel}
                  onChange={(e) =>
                    handleInputChange("carModel", e.target.value)
                  }
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none text-white ${
                    formErrors.carModel
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="BMW X5, Mercedes C-Class, etc."
                />
                {formErrors.carModel && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.carModel}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Does your car have a sunroof? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sunroof"
                      value="yes"
                      checked={formData.sunroof === "yes"}
                      className="mr-2 accent-primary"
                      onChange={(e) => {
                        handleInputChange("sunroof", e.target.value);
                        setHasSunroof(e.target.value);
                      }}
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sunroof"
                      value="no"
                      checked={formData.sunroof === "no"}
                      className="mr-2 accent-primary"
                      onChange={(e) => {
                        handleInputChange("sunroof", e.target.value);
                        setHasSunroof(e.target.value);
                      }}
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
                {formErrors.sunroof && (
                  <p className="text-red-400 text-sm mt-1">
                    {formErrors.sunroof}
                  </p>
                )}
              </div>

              {/* Conditional Electric Sunroof Question */}
              {hasSunroof === "yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Is it an electric sunroof? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="electricSunroof"
                        value="yes"
                        checked={formData.electricSunroof === "yes"}
                        className="mr-2 accent-primary"
                        onChange={(e) =>
                          handleInputChange("electricSunroof", e.target.value)
                        }
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="electricSunroof"
                        value="no"
                        checked={formData.electricSunroof === "no"}
                        className="mr-2 accent-primary"
                        onChange={(e) =>
                          handleInputChange("electricSunroof", e.target.value)
                        }
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                  {formErrors.electricSunroof && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.electricSunroof}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-3">
                  Get Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



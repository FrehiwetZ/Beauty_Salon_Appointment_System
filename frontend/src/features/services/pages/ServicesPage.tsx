import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ServiceGrid from "../components/ServiceGrid";

function ServicesPage() {
  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">

        <div className="text-center mb-10">

          <p className="text-pink-600 font-medium">
            Our Services
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Beauty services for you
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Choose from our hair, makeup, facial and nail services.
          </p>

        </div>

        <ServiceGrid />

      </main>

      <Footer />

    </div>
  );
}

export default ServicesPage;
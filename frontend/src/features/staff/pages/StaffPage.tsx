import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import StaffGrid from "../components/StaffGrid";

function StaffPage() {
  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-12">

        <div className="text-center mb-10">

          <p className="text-pink-600 font-medium">
            Our Team
          </p>

          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            Meet Our Staff
          </h1>

          <p className="text-gray-600 mt-3">
            Our friendly beauty professionals are here to help you.
          </p>

        </div>

        <StaffGrid />

      </main>

      <Footer />

    </div>
  );
}

export default StaffPage;
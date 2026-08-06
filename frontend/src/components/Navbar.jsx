// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav class="relative container mx-auto p-6">
      <div class="flex items-center justify-between">
        {/* Logo-section */}
        <div class="pt-2">
          <img src="#" alt="logo" />
        </div>
        {/* Menu-items */}
        <div class="md:flex space-x-6 hidden">
          <a href="#" class="hover:text-blue-300">Home</a>
          <a href="#" class="hover:text-blue-300">Services</a>
          <a href="#" class="hover:text-blue-300">About Us</a>
          <a href="#" class="hover:text-blue-300">Careers</a>
          <a href="#" class="hover:text-blue-300">Community</a>
        </div>
        <div>
          <a
            href="#"
            class="hidden md:block rounded-full p-3 text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
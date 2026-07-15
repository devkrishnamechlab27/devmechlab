export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-10 py-5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">

      {/* Logo */}
      <h1 className="text-3xl font-extrabold cursor-pointer">
        <span className="text-blue-500">Dev</span>
        <span className="text-white">Mech</span>
        <span className="text-orange-500">Lab</span>
      </h1>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8 text-[17px]">

        <a href="#" className="hover:text-blue-500 transition">
          Home
        </a>

        <a href="#" className="hover:text-blue-500 transition">
          Courses
        </a>

        <a href="#" className="hover:text-blue-500 transition">
          Internships
        </a>

        <a href="#" className="hover:text-blue-500 transition">
          Certificates
        </a>

        <a href="#" className="hover:text-blue-500 transition">
          Contact
        </a>

      </div>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">

        <button className="px-5 py-2 rounded-lg border border-slate-600 hover:border-blue-500 transition">
          Login
        </button>

        <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold">
          Get Started
        </button>

      </div>

    </nav>
  );
}
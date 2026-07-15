export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800 bg-slate-950 text-white">

      <h1 className="text-3xl font-bold">
        <span className="text-blue-500">Dev</span>
        <span className="text-white">Mech</span>
        <span className="text-orange-500">Lab</span>
      </h1>

      <div className="space-x-8">
        <a href="#">Home</a>
        <a href="#">Courses</a>
        <a href="#">Internships</a>
        <a href="#">Certificates</a>
        <a href="#">Contact</a>
      </div>

    </nav>
  );
}
export default function Topbar() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold">
          Student Dashboard
        </h2>

        <p className="text-gray-400 text-sm">
          Welcome back 👋
        </p>
      </div>

      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">
        K
      </div>

    </header>
  );
}
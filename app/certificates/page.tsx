export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          🏆 My Certificates
        </h1>

        <p className="text-gray-400 mb-10">
          Certificates you earn from DevMechLab courses and internships will appear here.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold">
            No Certificates Yet
          </h2>

          <p className="text-gray-400 mt-4">
            Complete a course or internship to receive your first certificate.
          </p>
        </div>
      </div>
    </main>
  );
}
export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}
      <section className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-20">

          <p className="text-blue-400 font-semibold">
            DEVMECHLAB CERTIFICATES
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold mt-4">
            Engineering Skills.
            <br />
            <span className="text-orange-500">
              Recognized & Verified.
            </span>
          </h1>

          <p className="max-w-3xl mt-6 text-lg text-gray-400 leading-8">
            DevMechLab certificates recognize successful completion of
            our engineering courses and internship programs. Each
            certificate is designed with a unique verification identity
            for authenticity.
          </p>

        </div>
      </section>


      {/* CERTIFICATE TYPES */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="text-center max-w-3xl mx-auto">

          <p className="text-orange-500 font-semibold">
            CERTIFICATE PROGRAMS
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Certificates You Can Earn
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Complete your learning or internship requirements and
            receive a DevMechLab certificate.
          </p>

        </div>


        <div className="grid md:grid-cols-2 gap-8 mt-14">

          {/* COURSE CERTIFICATE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/60 transition">

            <div className="text-5xl">
              🎓
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Course Completion Certificate
            </h3>

            <p className="text-gray-400 mt-4 leading-7">
              Earn a certificate after successfully completing a
              DevMechLab course and meeting the required completion
              criteria.
            </p>

            <div className="mt-6 space-y-3 text-gray-300">

              <p>✅ Course name</p>
              <p>✅ Student name</p>
              <p>✅ Course duration</p>
              <p>✅ Completion status</p>
              <p>✅ Issue date</p>
              <p>✅ Unique Certificate ID</p>
              <p>✅ QR verification</p>

            </div>

          </div>


          {/* INTERNSHIP CERTIFICATE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-orange-500/60 transition">

            <div className="text-5xl">
              🏆
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Internship Certificate
            </h3>

            <p className="text-gray-400 mt-4 leading-7">
              Receive an internship certificate after successfully
              completing the requirements of a DevMechLab internship
              program.
            </p>

            <div className="mt-6 space-y-3 text-gray-300">

              <p>✅ Internship title</p>
              <p>✅ Student name</p>
              <p>✅ Internship duration</p>
              <p>✅ Completion status</p>
              <p>✅ Issue date</p>
              <p>✅ Unique Certificate ID</p>
              <p>✅ QR verification</p>

            </div>

          </div>

        </div>

      </section>


      {/* VERIFICATION */}
      <section className="bg-slate-900/50 border-y border-slate-800">

        <div className="max-w-4xl mx-auto px-8 py-20">

          <div className="text-center">

            <p className="text-blue-400 font-semibold">
              CERTIFICATE VERIFICATION
            </p>

            <h2 className="text-4xl font-bold mt-3">
              Verify a DevMechLab Certificate
            </h2>

            <p className="text-gray-400 mt-5 text-lg leading-7">
              Enter the unique Certificate ID printed on a DevMechLab
              certificate to verify its authenticity.
            </p>

          </div>


          <div className="mt-10 bg-slate-950 border border-slate-800 rounded-2xl p-8">

            <label
              htmlFor="certificate-id"
              className="block text-sm font-semibold text-gray-300 mb-3"
            >
              Certificate ID
            </label>

            <input
              id="certificate-id"
              type="text"
              placeholder="Example: DML-C-2026-0001"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl font-bold text-lg"
            >
              Verify Certificate
            </button>

            <p className="text-gray-500 text-sm text-center mt-5">
              Certificate verification will be available through the
              DevMechLab verification system.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="text-center">

          <p className="text-orange-500 font-semibold">
            HOW IT WORKS
          </p>

          <h2 className="text-4xl font-bold mt-3">
            From Learning to Certification
          </h2>

        </div>


        <div className="grid md:grid-cols-3 gap-6 mt-14">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 text-center">

            <div className="text-4xl">
              📚
            </div>

            <h3 className="text-xl font-bold mt-5">
              01. Learn
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Complete the lessons, assignments, and required learning
              activities.
            </p>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 text-center">

            <div className="text-4xl">
              ✅
            </div>

            <h3 className="text-xl font-bold mt-5">
              02. Complete
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Fulfill the completion requirements of your course or
              internship.
            </p>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 text-center">

            <div className="text-4xl">
              🏆
            </div>

            <h3 className="text-xl font-bold mt-5">
              03. Get Certified
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              Receive your certificate with a unique verification
              identity.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20 text-center">

          <h2 className="text-4xl md:text-5xl font-bold">
            Start Building Your
            <span className="text-blue-500">
              {" "}Engineering Skills
            </span>
          </h2>

          <p className="text-gray-400 text-lg mt-5">
            Learn practical skills and work toward your DevMechLab
            certificate.
          </p>

          <a
            href="/courses"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition"
          >
            Explore Courses
          </a>

        </div>

      </section>

    </main>
  );
}
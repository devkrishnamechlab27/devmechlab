import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export default async function VerifyCertificatePage({
  params,
}: Props) {
  const { certificateNumber } = await params;

  const supabase = await createClient();

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select(`
      certificate_number,
      issued_at,
      qr_code,
      courses (
        title,
        duration
      )
    `)
    .eq("certificate_number", certificateNumber)
    .maybeSingle();

  if (error) {
    console.error("CERTIFICATE VERIFY ERROR:", error);
  }

  if (!certificate) {
    notFound();
  }
  const course = Array.isArray(certificate.courses)
  ? certificate.courses[0]
  : certificate.courses;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-900 border border-green-500/40 rounded-3xl p-10">

        <div className="text-center">

          <div className="text-6xl mb-5">
            🏅
          </div>

          <h1 className="text-4xl font-bold text-green-400">
            Certificate Verified
          </h1>

          <p className="text-gray-400 mt-3">
            This certificate is officially issued by DevMechLab.
          </p>

        </div>

        <div className="mt-10 space-y-5">

          <div>
            <p className="text-gray-500 text-sm">
              Certificate Number
            </p>

            <p className="text-xl font-bold text-orange-400">
              {certificate.certificate_number}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Course
            </p>

            <p className="text-xl font-semibold">
              {course?.title}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Duration
            </p>

            <p className="text-lg">
              {course?.duration}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Issued Date
            </p>

            <p className="text-lg">
              {new Date(
                certificate.issued_at
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-center">

          <p className="text-green-400 font-semibold">
            ✓ Authentic DevMechLab Certificate
          </p>

          <p className="text-gray-500 text-sm mt-2">
            This certificate was verified against the DevMechLab certificate database.
          </p>

        </div>

      </div>
    </main>
  );
}
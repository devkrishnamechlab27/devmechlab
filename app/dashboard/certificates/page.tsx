"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CertificatesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    async function loadCertificates() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          courses (
            title,
            slug
          )
        `)
        .eq("user_id", session.user.id)
        .order("issued_at", { ascending: false });

        console.log("CERTIFICATES DATA:", data);

if (error) {
  console.error("CERTIFICATES ERROR:", error);
}

      if (!error && data) {
        setCertificates(data);
      }

      setLoading(false);
    }

    loadCertificates();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white">
        Loading Certificates...
      </main>
    );
  }

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Certificates
        </h1>

        <p className="text-gray-400 mt-2">
          Download your verified certificates.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Certificates Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Complete a course to earn your first certificate.
          </p>

        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">

          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold">
                {certificate.courses.title}
              </h2>

              <p className="text-gray-400 mt-3">
                Issued:
                {" "}
                {new Date(certificate.issued_at).toLocaleDateString()}
              </p>

              <div className="flex gap-4 mt-8">

                <a
                 href={`/api/certificates/download/${certificate.certificate_number}`}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                >
                  Download
                </a>

                <a
                  href={`/verify/${certificate.certificate_number}`}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
                >
                  Verify
                </a>
              
              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}
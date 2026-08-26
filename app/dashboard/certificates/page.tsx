"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Certificate = {
  id: number;
  certificate_number: string;
  pdf_url: string | null;
  qr_code: string | null;
  issued_at: string;
  type: "course" | "internship";
  title: string;
};

export default function CertificatesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function loadCertificates() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      /*
       * ==========================================
       * 1. COURSE CERTIFICATES
       * ==========================================
       */

      const {
        data: courseCertificates,
        error: courseCertificateError,
      } = await supabase
        .from("certificates")
        .select(`
          id,
          certificate_number,
          pdf_url,
          qr_code,
          issued_at,
          courses (
            title,
            slug
          )
        `)
        .eq("user_id", session.user.id)
        .order("issued_at", {
          ascending: false,
        });

      if (courseCertificateError) {
        console.error(
          "COURSE CERTIFICATES ERROR:",
          courseCertificateError
        );
      }

      /*
       * ==========================================
       * 2. INTERNSHIP CERTIFICATES
       * ==========================================
       */

      const {
        data: internshipCertificates,
        error: internshipCertificateError,
      } = await supabase
        .from("internship_certificates")
        .select(`
          id,
          certificate_number,
          pdf_url,
          qr_code,
          issued_at,
          internships (
            title
          )
        `)
        .eq("user_id", session.user.id)
        .order("issued_at", {
          ascending: false,
        });

      if (internshipCertificateError) {
        console.error(
          "INTERNSHIP CERTIFICATES ERROR:",
          internshipCertificateError
        );
      }

      /*
       * ==========================================
       * 3. CONVERT COURSE CERTIFICATES
       * ==========================================
       */

      const formattedCourseCertificates: Certificate[] =
        (courseCertificates ?? []).map(
          (certificate: any) => ({
            id: certificate.id,
            certificate_number:
              certificate.certificate_number,
            pdf_url: certificate.pdf_url,
            qr_code: certificate.qr_code,
            issued_at: certificate.issued_at,
            type: "course",
            title:
              certificate.courses?.title ||
              "Course Certificate",
          })
        );

      /*
       * ==========================================
       * 4. CONVERT INTERNSHIP CERTIFICATES
       * ==========================================
       */

      const formattedInternshipCertificates: Certificate[] =
        (internshipCertificates ?? []).map(
          (certificate: any) => ({
            id: certificate.id,
            certificate_number:
              certificate.certificate_number,
            pdf_url: certificate.pdf_url,
            qr_code: certificate.qr_code,
            issued_at: certificate.issued_at,
            type: "internship",
            title:
              certificate.internships?.title ||
              "Internship Certificate",
          })
        );

      /*
       * ==========================================
       * 5. COMBINE BOTH
       * ==========================================
       */

      const combinedCertificates = [
        ...formattedCourseCertificates,
        ...formattedInternshipCertificates,
      ].sort(
        (a, b) =>
          new Date(b.issued_at).getTime() -
          new Date(a.issued_at).getTime()
      );

      console.log(
        "ALL CERTIFICATES:",
        combinedCertificates
      );

      setCertificates(combinedCertificates);

      setLoading(false);
    }

    loadCertificates();
  }, [router]);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white">
        Loading Certificates...
      </main>
    );
  }

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Certificates
        </h1>

        <p className="text-gray-400 mt-2">
          Download and verify your course and internship certificates.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center">

          <h2 className="text-2xl font-bold text-white">
            No Certificates Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Complete a course or internship to earn your certificate.
          </p>

        </div>
      ) : (

        <div className="grid lg:grid-cols-2 gap-8">

          {certificates.map((certificate) => (

            <div
              key={`${certificate.type}-${certificate.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
            >

              {/* TYPE */}

              <div className="flex items-center justify-between">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    certificate.type === "internship"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  {certificate.type === "internship"
                    ? "INTERNSHIP"
                    : "COURSE"}
                </span>

              </div>

              {/* TITLE */}

              <h2 className="text-2xl font-bold text-white mt-5">
                {certificate.title}
              </h2>

              {/* CERTIFICATE NUMBER */}

              <p className="text-gray-500 text-sm mt-3">
                Certificate No:
              </p>

              <p className="text-gray-300 text-sm font-mono">
                {certificate.certificate_number}
              </p>

              {/* ISSUE DATE */}

              <p className="text-gray-400 mt-4">
                Issued:{" "}
                {new Date(
                  certificate.issued_at
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* BUTTONS */}

              <div className="flex gap-4 mt-8 flex-wrap">

                {/* DOWNLOAD */}

                <a
                  href={
                    certificate.type === "internship"
                      ? `/api/internship-certificates/download/${certificate.certificate_number}`
                      : `/api/certificates/download/${certificate.certificate_number}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                  Download
                </a>

                {/* VERIFY */}

                <a
                  href={
                    certificate.type === "internship"
                      ? `/verify/internship/${certificate.certificate_number}`
                      : `/verify/${certificate.certificate_number}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
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
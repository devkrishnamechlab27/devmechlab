import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const resolvedParams = await params;

    console.log(
      "INTERNSHIP DOWNLOAD PARAMS:",
      resolvedParams
    );

    const certificateNumber =
      resolvedParams.certificateNumber;

    console.log(
      "INTERNSHIP DOWNLOAD CERTIFICATE NUMBER:",
      certificateNumber
    );

    const supabase = await createClient();

    /*
     * AUTHENTICATED USER
     */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(
      "INTERNSHIP DOWNLOAD USER ID:",
      user.id
    );

    /*
     * INTERNSHIP CERTIFICATE
     */

    const {
      data: certificates,
      error: certificateError,
    } = await supabase
      .from("internship_certificates")
      .select(
        "id, user_id, certificate_number, pdf_url"
      )
      .eq(
        "certificate_number",
        certificateNumber
      )
      .eq(
        "user_id",
        user.id
      );

    console.log(
      "INTERNSHIP DOWNLOAD CERTIFICATE DATA:",
      certificates
    );

    console.log(
      "INTERNSHIP DOWNLOAD CERTIFICATE ERROR:",
      certificateError
    );

    /*
     * CHECK CERTIFICATE
     */

    const certificate =
      certificates?.[0];

    if (
      certificateError ||
      !certificate ||
      !certificate.pdf_url
    ) {
      console.error(
        "INTERNSHIP CERTIFICATE DOWNLOAD ERROR:",
        certificateError
      );

      return NextResponse.json(
        {
          error:
            "Internship certificate PDF not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "INTERNSHIP DOWNLOAD PDF PATH:",
      certificate.pdf_url
    );

    /*
     * CREATE SIGNED URL
     */

    const {
      data: signedUrl,
      error: signedError,
    } = await supabase.storage
      .from("certificates")
      .createSignedUrl(
        certificate.pdf_url,
        60
      );

    if (
      signedError ||
      !signedUrl?.signedUrl
    ) {
      console.error(
        "INTERNSHIP SIGNED URL ERROR:",
        signedError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create internship certificate download link.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * FETCH PDF
     */

    const pdfResponse =
      await fetch(
        signedUrl.signedUrl
      );

    if (!pdfResponse.ok) {
      console.error(
        "INTERNSHIP PDF FETCH ERROR:",
        pdfResponse.status
      );

      return NextResponse.json(
        {
          error:
            "Unable to fetch internship certificate PDF.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * PDF DATA
     */

    const pdfBuffer =
      await pdfResponse.arrayBuffer();

    console.log(
      "INTERNSHIP PDF FETCH SUCCESSFULLY"
    );

    /*
     * RETURN PDF
     */

    return new NextResponse(
      pdfBuffer,
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${certificate.certificate_number}.pdf"`,

          "Content-Length":
            pdfBuffer.byteLength.toString(),
        },
      }
    );

  } catch (error) {
    console.error(
      "INTERNSHIP DOWNLOAD ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internship certificate download failed.",
      },
      {
        status: 500,
      }
    );
  }
}
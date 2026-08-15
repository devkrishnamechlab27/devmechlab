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
    /*
     * ROUTE PARAMETER
     */

    const resolvedParams = await params;

    console.log(
      "DOWNLOAD PARAMS:",
      resolvedParams
    );

    const certificateNumber =
      resolvedParams.certificateNumber;

    console.log(
      "DOWNLOAD CERTIFICATE NUMBER:",
      certificateNumber
    );

    /*
     * SUPABASE
     */

    const supabase =
      await createClient();

    /*
     * AUTHENTICATED USER
     */

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      "DOWNLOAD USER ID:",
      user.id
    );

    /*
     * CERTIFICATE
     */

    const {
      data: certificates,
      error: certificateError,
    } =
      await supabase
        .from("certificates")
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
      "DOWNLOAD CERTIFICATE DATA:",
      certificates
    );

    console.log(
      "DOWNLOAD CERTIFICATE ERROR:",
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
        "CERTIFICATE DOWNLOAD ERROR:",
        certificateError
      );

      return NextResponse.json(
        {
          error:
            "Certificate PDF not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "DOWNLOAD PDF PATH:",
      certificate.pdf_url
    );

    /*
     * CREATE SIGNED URL
     */

    const {
      data: signedUrl,
      error: signedError,
    } =
      await supabase.storage
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
        "SIGNED URL ERROR:",
        signedError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create download link.",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "SIGNED URL CREATED SUCCESSFULLY"
    );

    /*
     * FETCH PDF
     */

    const pdfResponse =
      await fetch(
        signedUrl.signedUrl
      );

    if (!pdfResponse.ok) {
      console.error(
        "PDF FETCH ERROR:",
        pdfResponse.status
      );

      return NextResponse.json(
        {
          error:
            "Unable to fetch certificate PDF.",
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
      "PDF FETCH SUCCESSFULLY"
    );

    /*
     * RETURN PDF DIRECTLY
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
      "DOWNLOAD ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Download failed.",
      },
      {
        status: 500,
      }
    );
  }
}
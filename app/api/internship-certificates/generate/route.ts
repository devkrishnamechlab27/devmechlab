import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts,} from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    /*
     * 1. AUTHENTICATED USER
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

    /*
     * 2. REQUEST BODY
     */
    const body = await request.json();

    const internshipId = Number(body.internshipId);

    if (
      !Number.isInteger(internshipId) ||
      internshipId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Valid internship ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * 3. INTERNSHIP
     */
    const {
      data: internship,
      error: internshipError,
    } = await supabase
      .from("internships")
      .select(
        "id, title, duration, level, lessons, certificate"
      )
      .eq("id", internshipId)
      .single();

    if (internshipError || !internship) {
      console.error(
        "INTERNSHIP LOOKUP ERROR:",
        internshipError
      );

      return NextResponse.json(
        { error: "Internship not found." },
        { status: 404 }
      );
    }

    /*
     * 4. CERTIFICATE ENABLED
     */
    if (!internship.certificate) {
      return NextResponse.json(
        {
          error:
            "Certificate is not available for this internship.",
        },
        { status: 403 }
      );
    }

    /*
     * 5. VERIFY ENROLLMENT
     */
    const {
      data: enrollment,
      error: enrollmentError,
    } = await supabase
      .from("internship_enrollments")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .eq("internship_id", internshipId)
      .maybeSingle();

    if (enrollmentError) {
      console.error(
        "INTERNSHIP ENROLLMENT ERROR:",
        enrollmentError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify enrollment.",
        },
        { status: 500 }
      );
    }

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "You are not enrolled in this internship.",
        },
        { status: 403 }
      );
    }

    /*
     * 6. GET ALL INTERNSHIP LESSONS
     */
    const {
      data: lessons,
      error: lessonsError,
    } = await supabase
      .from("internship_lessons")
      .select("id")
      .eq("internship_id", internshipId);

    if (lessonsError) {
      console.error(
        "INTERNSHIP LESSON ERROR:",
        lessonsError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify internship lessons.",
        },
        { status: 500 }
      );
    }

    const totalLessons = lessons?.length ?? 0;

    if (totalLessons === 0) {
      return NextResponse.json(
        {
          error:
            "No lessons are configured for this internship.",
        },
        { status: 400 }
      );
    }

    /*
     * 7. GET COMPLETED LESSONS
     */
    const {
      data: completedRows,
      error: progressError,
    } = await supabase
      .from("internship_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("internship_id", internshipId)
      .eq("completed", true);

    if (progressError) {
      console.error(
        "INTERNSHIP PROGRESS ERROR:",
        progressError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify internship progress.",
        },
        { status: 500 }
      );
    }

    /*
     * 8. VALID COMPLETED LESSON IDS
     */
    const validLessonIds = new Set(
      (lessons ?? []).map(
        (lesson) => lesson.id
      )
    );

    const completedLessonIds = new Set(
      (completedRows ?? [])
        .map((row) => row.lesson_id)
        .filter((lessonId) =>
          validLessonIds.has(lessonId)
        )
    );

    const completedLessons =
      completedLessonIds.size;

    /*
     * 9. REQUIRE 100% COMPLETION
     */
    if (
      completedLessons < totalLessons
    ) {
      return NextResponse.json(
        {
          error:
            "Internship is not fully completed.",
          completedLessons,
          totalLessons,
        },
        { status: 400 }
      );
    }

    /*
     * 10. PROFILE
     */
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "PROFILE ERROR:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Student profile not found.",
        },
        { status: 404 }
      );
    }

    /*
     * 11. CHECK EXISTING CERTIFICATE
     */
    let {
      data: certificate,
      error: certificateCheckError,
    } = await supabase
      .from("internship_certificates")
      .select("*")
      .eq("user_id", user.id)
      .eq("internship_id", internshipId)
      .maybeSingle();

    if (certificateCheckError) {
      console.error(
        "CERTIFICATE CHECK ERROR:",
        certificateCheckError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check certificate.",
        },
        { status: 500 }
      );
    }

    /*
     * 12. CREATE CERTIFICATE RECORD
     *
     * IMPORTANT:
     * This happens BEFORE PDF generation because
     * the PDF needs certificate.certificate_number.
     */
    if (!certificate) {
      const year =
        new Date().getFullYear();

      const randomPart = randomBytes(5)
        .toString("hex")
        .toUpperCase();

      const generatedCertificateNumber =
        `DML-I-${internshipId}-${year}-${randomPart}`;

      const {
        data: newCertificate,
        error: insertError,
      } = await supabase
        .from("internship_certificates")
        .insert({
          user_id: user.id,
          internship_id: internshipId,
          certificate_number:
            generatedCertificateNumber,
        })
        .select("*")
        .single();

      if (
        insertError ||
        !newCertificate
      ) {
        /*
         * Concurrent request protection
         */
        if (
          insertError?.code === "23505"
        ) {
          const {
            data: existingCertificate,
            error: retryError,
          } = await supabase
            .from(
              "internship_certificates"
            )
            .select("*")
            .eq("user_id", user.id)
            .eq(
              "internship_id",
              internshipId
            )
            .maybeSingle();

          if (
            retryError ||
            !existingCertificate
          ) {
            console.error(
              "CERTIFICATE RETRY LOAD ERROR:",
              retryError
            );

            return NextResponse.json(
              {
                error:
                  "Certificate already exists, but could not be loaded.",
              },
              { status: 500 }
            );
          }

          certificate =
            existingCertificate;
        } else {
          console.error(
            "INTERNSHIP CERTIFICATE INSERT ERROR:",
            insertError
          );

          return NextResponse.json(
            {
              error:
                "Unable to create internship certificate.",
            },
            { status: 500 }
          );
        }
      } else {
        certificate =
          newCertificate;
      }
    }

    /*
     * At this point certificate ALWAYS exists.
     *
     * This is what fixes:
     *
     * Block-scoped variable 'certificate'
     * used before its declaration.
     */

    /*
     * 13. CERTIFICATE NUMBER
     */
    const certificateNumber =
      certificate.certificate_number;

    /*
     * 14. VERIFICATION URL
     */
    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin;

    const verificationUrl =
      `${siteUrl}/verify/internship/${certificateNumber}`;

    console.log(
      "VERIFICATION URL:",
      verificationUrl
    );

    /*
     * 15. GENERATE QR CODE
     */
    const qrDataUrl =
      await QRCode.toDataURL(
        verificationUrl,
        {
          width: 300,
          margin: 2,
        }
      );

    const qrBase64 =
      qrDataUrl.split(",")[1];

    const qrBytes = Buffer.from(
      qrBase64,
      "base64"
    );

    /*
     * 16. PDF GENERATION
     */
    const pdfDoc =
      await PDFDocument.create();

    const page =
      pdfDoc.addPage([
        841.89,
        595.28,
      ]);

    const width =
      page.getWidth();

    const height =
      page.getHeight();

    /*
     * FONTS
     */
    const fontRegular =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    const fontBold =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    /*
     * COLORS
     */
    const navy = rgb(
      0.02,
      0.07,
      0.16
    );

    const blue = rgb(
      0.04,
      0.32,
      0.88
    );

    const orange = rgb(
      1,
      0.42,
      0.05
    );

    const gold = rgb(
      0.88,
      0.63,
      0.12
    );

    const white = rgb(
      0.98,
      0.98,
      0.98
    );

    const gray = rgb(
      0.35,
      0.38,
      0.43
    );

    /*
     * BACKGROUND
     */
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: white,
    });

    /*
     * OUTER BORDER
     */
    page.drawRectangle({
      x: 10,
      y: 10,
      width: width - 20,
      height: height - 20,
      borderColor: navy,
      borderWidth: 3,
    });

    page.drawRectangle({
      x: 18,
      y: 18,
      width: width - 36,
      height: height - 36,
      borderColor: orange,
      borderWidth: 1.5,
    });
    /*
 * TOP-LEFT MEDAL
 */

try {
  const medalPath = path.join(
    process.cwd(),
    "public",
    "images",
    "devmechlab-medal-reference.png"
  );

  const medalBytes = await fs.readFile(medalPath);

  const medalImage = await pdfDoc.embedPng(
    medalBytes
  );

  const medalWidth = 115;

  const medalScale =
    medalWidth / medalImage.width;

  const medalHeight =
    medalImage.height * medalScale;

  page.drawImage(medalImage, {
    x: 0,
    y: height - medalHeight,
    width: medalWidth,
    height: medalHeight,
  });
} catch (medalError) {
  console.error(
    "MEDAL IMAGE ERROR:",
    medalError
  );
}

    /*
     * LOGO
     */
    try {
      const logoPath =
        path.join(
          process.cwd(),
          "public",
          "images",
          "devmechlab_logo.png"
        );

      const logoBytes =
        await fs.readFile(
          logoPath
        );

      const logoImage =
        await pdfDoc.embedPng(
          logoBytes
        );

      const maxLogoWidth =
        250;

      const maxLogoHeight =
        115;

      const logoScale =
        Math.min(
          maxLogoWidth /
            logoImage.width,
          maxLogoHeight /
            logoImage.height
        );

      const logoWidth =
        logoImage.width *
        logoScale;

      const logoHeight =
        logoImage.height *
        logoScale;

      page.drawImage(
        logoImage,
        {
          x:
            (width -
              logoWidth) /
            2,
          y:
            height - 115,
          width:
            logoWidth,
          height:
            logoHeight,
        }
      );
    } catch (logoError) {
      console.error(
        "LOGO ERROR:",
        logoError
      );

      page.drawText(
        "DevMechLab",
        {
          x: 55,
          y: height - 75,
          size: 25,
          font: fontBold,
          color: blue,
        }
      );
    }

    /*
     * CERTIFICATE NUMBER
     */
    page.drawText(
      "CERTIFICATE NO.",
      {
        x: 675,
        y: height - 48,
        size: 8,
        font: fontBold,
        color: gray,
      }
    );

    const certificateNumberText =
      certificate.certificate_number;

    let certificateNumberSize =
      10;

    while (
      fontBold.widthOfTextAtSize(
        certificateNumberText,
        certificateNumberSize
      ) > 180 &&
      certificateNumberSize > 7
    ) {
      certificateNumberSize -= 0.5;
    }

    page.drawText(
      certificateNumberText,
      {
        x: 675,
        y: height - 65,
        size:
          certificateNumberSize,
        font: fontBold,
        color: blue,
      }
    );

    /*
     * TITLE
     */
    const title =
      "CERTIFICATE";

    const titleSize = 36;

    const titleWidth =
      fontBold.widthOfTextAtSize(
        title,
        titleSize
      );

    page.drawText(title, {
      x:
        (width -
          titleWidth) /
        2,
      y: height - 185,
      size: titleSize,
      font: fontBold,
      color: navy,
    });

    /*
     * SUBTITLE
     */
    const subtitle =
      "OF COMPLETION";

    const subtitleSize =
      16;

    const subtitleWidth =
      fontBold.widthOfTextAtSize(
        subtitle,
        subtitleSize
      );

    page.drawText(
      subtitle,
      {
        x:
          (width -
            subtitleWidth) /
          2,
        y: height - 210,
        size:
          subtitleSize,
        font: fontBold,
        color: orange,
      }
    );

    /*
     * DECORATIVE LINES
     */
    page.drawLine({
      start: {
        x: 205,
        y: height - 202,
      },
      end: {
        x: 315,
        y: height - 202,
      },
      thickness: 1,
      color: gold,
    });

    page.drawLine({
      start: {
        x: 527,
        y: height - 202,
      },
      end: {
        x: 637,
        y: height - 202,
      },
      thickness: 1,
      color: gold,
    });

    /*
     * CERTIFY TEXT
     */
    const certifyText =
      "THIS IS TO CERTIFY THAT";

    page.drawText(
      certifyText,
      {
        x:
          (width -
            fontRegular.widthOfTextAtSize(
              certifyText,
              10
            )) /
          2,
        y: height - 245,
        size: 10,
        font: fontRegular,
        color: gray,
      }
    );

    /*
     * STUDENT NAME
     */
    const studentName =
      profile.full_name ||
      "Student";

    const studentSize =
      30;

    const studentWidth =
      fontBold.widthOfTextAtSize(
        studentName,
        studentSize
      );

    page.drawText(
      studentName,
      {
        x:
          (width -
            studentWidth) /
          2,
        y: height - 290,
        size:
          studentSize,
        font: fontBold,
        color: navy,
      }
    );

    /*
     * NAME UNDERLINE
     */
    page.drawLine({
      start: {
        x: 205,
        y: height - 300,
      },
      end: {
        x: 637,
        y: height - 300,
      },
      thickness: 1,
      color: gold,
    });

    /*
     * INTERNSHIP DURATION
     */
    const durationValue =
      String(
        internship.duration ||
          ""
      ).match(/\d+/)?.[0] ??
      "";

    const durationText =
      durationValue
        ? `${durationValue}-week internship`
        : "internship";

    /*
     * INTERNSHIP STATEMENTS
     */
    const statement =
      `has successfully completed the ${durationText} in ${internship.title}`;

    const statement2 =
      "and has demonstrated the required knowledge and skills";

    const statement3 =
      "to complete the internship with excellence.";

    const statement4 =
      `from ${formatDate(
        new Date(
          enrollment.created_at ||
            new Date()
        )
      )} to ${formatDate(
        new Date()
      )}`;

    /*
     * CENTERED TEXT HELPER
     */
    function drawCenteredText(
      text: string,
      y: number,
      size: number,
      font: any,
      color: any
    ) {
      const textWidth =
        font.widthOfTextAtSize(
          text,
          size
        );

      page.drawText(
        text,
        {
          x:
            (width -
              textWidth) /
            2,
          y,
          size,
          font,
          color,
        }
      );
    }

    drawCenteredText(
      statement,
      height - 328,
      11,
      fontRegular,
      navy
    );

    drawCenteredText(
      statement2,
      height - 346,
      11,
      fontRegular,
      navy
    );

    drawCenteredText(
      statement3,
      height - 364,
      11,
      fontRegular,
      navy
    );

    drawCenteredText(
      statement4,
      height - 382,
      11,
      fontRegular,
      navy
    );

    /*
     * INFORMATION STRIP
     */
    const infoX = 118;
    const infoY = 125;
    const infoWidth = 605;
    const infoHeight = 65;

    page.drawRectangle({
      x: infoX,
      y: infoY,
      width: infoWidth,
      height: infoHeight,
      borderColor: gold,
      borderWidth: 1,
    });

    /*
     * VERTICAL SEPARATORS
     */
    const columns = 4;

    const columnWidth =
      infoWidth / columns;

    for (
      let i = 1;
      i < columns;
      i++
    ) {
      page.drawLine({
        start: {
          x:
            infoX +
            columnWidth * i,
          y: infoY,
        },
        end: {
          x:
            infoX +
            columnWidth * i,
          y:
            infoY +
            infoHeight,
        },
        thickness: 1,
        color: gold,
      });
    }

    /*
     * INFORMATION HELPER
     */
    function drawInfoColumn(
      index: number,
      label: string,
      value: string
    ) {
      const center =
        infoX +
        columnWidth * index +
        columnWidth / 2;

      const labelSize = 7;
      const valueSize = 9;

      const labelWidth =
        fontBold.widthOfTextAtSize(
          label,
          labelSize
        );

      const valueWidth =
        fontBold.widthOfTextAtSize(
          value,
          valueSize
        );

      page.drawText(
        label,
        {
          x:
            center -
            labelWidth / 2,
          y: infoY + 39,
          size:
            labelSize,
          font: fontBold,
          color: gray,
        }
      );

      page.drawText(
        value,
        {
          x:
            center -
            valueWidth / 2,
          y: infoY + 20,
          size:
            valueSize,
          font: fontBold,
          color: navy,
        }
      );
    }

    drawInfoColumn(
      0,
      "INTERNSHIP DURATION",
      durationValue
        ? `${durationValue} WEEKS`
        : "N/A"
    );

    drawInfoColumn(
      1,
      "COMPLETION DATE",
      formatDate(
        new Date()
      )
    );

    drawInfoColumn(
      2,
      "MODE",
      "ONLINE"
    );

    drawInfoColumn(
      3,
      "LEVEL",
      internship.level ||
        "PROFESSIONAL"
    );

    /*
     * ISSUED DATE
     */
    const issuedText =
      `Issued: ${formatDate(
        new Date()
      )}`;

    page.drawText(
      issuedText,
      {
        x: 55,
        y: 105,
        size: 10,
        font: fontBold,
        color: gray,
      }
    );
     /*
 * BOTTOM-CENTER SEAL
 */

try {
  const sealPath = path.join(
    process.cwd(),
    "public",
    "images",
    "devmechlab-bottom-center-seal.png"
  );

  const sealBytes = await fs.readFile(sealPath);

  const sealImage = await pdfDoc.embedPng(
    sealBytes
  );

  const sealWidth = 200;

  const sealScale =
    sealWidth / sealImage.width;

  const sealHeight =
    sealImage.height * sealScale;

  page.drawImage(sealImage, {
    x: (width - sealWidth) / 2,
    y: 42,
    width: sealWidth,
    height: sealHeight,
  });
} catch (sealError) {
  console.error(
    "SEAL IMAGE ERROR:",
    sealError
  );
}

    /*
     * QR CODE
     */
    const qrImage =
      await pdfDoc.embedPng(
        qrBytes
      );

    page.drawImage(
      qrImage,
      {
        x: 55,
        y: 42,
        width: 58,
        height: 58,
      }
    );

    page.drawText(
      "SCAN TO VERIFY",
      {
        x: 48,
        y: 33,
        size: 6,
        font: fontBold,
        color: gray,
      }
    );

    /*
     * SIGNATURE
     */
    page.drawLine({
      start: {
        x: 635,
        y: 90,
      },
      end: {
        x: 775,
        y: 90,
      },
      thickness: 1,
      color: gray,
    });

    page.drawText(
      "K.K. Ranjan",
      {
        x: 680,
        y: 68,
        size: 13,
        font: fontBold,
        color: navy,
      }
    );

    page.drawText(
      "Founder & CEO",
      {
        x: 680,
        y: 51,
        size: 8,
        font: fontRegular,
        color: gray,
      }
    );

    page.drawText(
      "DevMechLab",
      {
        x: 680,
        y: 38,
        size: 8,
        font: fontRegular,
        color: orange,
      }
    );

    /*
     * VERIFICATION URL
     */
    const verifyText =
      `Verify this certificate: ${verificationUrl}`;

    const verifySize = 7;

    const verifyWidth =
      fontRegular.widthOfTextAtSize(
        verifyText,
        verifySize
      );

    page.drawText(
      verifyText,
      {
        x:
          (width -
            verifyWidth) /
          2,
        y: 24,
        size: verifySize,
        font: fontRegular,
        color: gray,
      }
    );

    /*
     * 17. SAVE PDF
     */
    const pdfBytes =
      await pdfDoc.save();

    /*
     * 18. STORAGE PATH
     */
    const storagePath =
      `${user.id}/${certificateNumber}.pdf`;

    /*
     * 19. UPLOAD PDF
     */
    const {
      error: uploadError,
    } = await supabase.storage
      .from("certificates")
      .upload(
        storagePath,
        pdfBytes,
        {
          contentType:
            "application/pdf",
          upsert: true,
        }
      );

    if (uploadError) {
      console.error(
        "INTERNSHIP CERTIFICATE UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Certificate PDF upload failed.",
        },
        { status: 500 }
      );
    }

    /*
     * 20. UPDATE CERTIFICATE RECORD
     */
    const {
      error: updateError,
    } = await supabase
      .from(
        "internship_certificates"
      )
      .update({
        pdf_url: storagePath,
        qr_code:
          verificationUrl,
      })
      .eq(
        "id",
        certificate.id
      )
      .eq(
        "user_id",
        user.id
      );

    if (updateError) {
      console.error(
        "INTERNSHIP CERTIFICATE UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Certificate record update failed.",
        },
        { status: 500 }
      );
    }

    /*
     * 21. SUCCESS
     */
    return NextResponse.json({
      success: true,
      existing:
        Boolean(
          certificate.pdf_url
        ),
      certificateNumber,
      pdfPath:
        storagePath,
      verificationUrl,
      studentName:
        profile.full_name,
      internshipTitle:
        internship.title,
      completedLessons,
      totalLessons,
    });
  } catch (error) {
    console.error(
      "INTERNSHIP CERTIFICATE GENERATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internship certificate generation failed.",
      },
      { status: 500 }
    );
  }
}

/*
 * DATE FORMAT
 */
function formatDate(
  date: Date
) {
  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}
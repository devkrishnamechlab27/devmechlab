import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
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

    /*
     * REQUEST BODY
     */

    const body = await request.json();
    const courseId = Number(body.courseId);

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required." },
        { status: 400 }
      );
    }

    /*
     * COURSE
     */

    const { data: course, error: courseError } =
      await supabase
        .from("courses")
        .select("id, title, slug, duration")
        .eq("id", courseId)
        .single();

    if (courseError || !course) {
      console.error("CERTIFICATE COURSE ERROR:", courseError);

      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    /*
     * ENROLLMENT
     */

    const { data: enrollment, error: enrollmentError } =
      await supabase
        .from("enrollments")
        .select("enrolled_at, completed, progress")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

    if (enrollmentError || !enrollment) {
      console.error(
        "CERTIFICATE ENROLLMENT ERROR:",
        enrollmentError
      );

      return NextResponse.json(
        { error: "Enrollment not found." },
        { status: 404 }
      );
    }

    /*
     * PROFILE
     */

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      console.error(
        "CERTIFICATE PROFILE ERROR:",
        profileError
      );

      return NextResponse.json(
        { error: "Student profile not found." },
        { status: 404 }
      );
    }

    /*
     * VERIFY ALL LESSONS ARE COMPLETE
     */

    const { data: lessons, error: lessonsError } =
      await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId);

    if (lessonsError) {
      console.error(
        "CERTIFICATE LESSON ERROR:",
        lessonsError
      );

      return NextResponse.json(
        { error: "Unable to check course lessons." },
        { status: 500 }
      );
    }

    const totalLessons = lessons?.length ?? 0;

    const { data: completedLessons, error: progressError } =
      await supabase
        .from("course_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .eq("completed", true);

    if (progressError) {
      console.error(
        "CERTIFICATE PROGRESS ERROR:",
        progressError
      );

      return NextResponse.json(
        { error: "Unable to check course progress." },
        { status: 500 }
      );
    }

    const completedCount =
      completedLessons?.length ?? 0;

    if (
      totalLessons === 0 ||
      completedCount < totalLessons
    ) {
      return NextResponse.json(
        {
          error: "Course is not fully completed.",
          completed: completedCount,
          total: totalLessons,
        },
        { status: 400 }
      );
    }

    /*
     * CERTIFICATE RECORD
     */

    let { data: certificate, error: certificateError } =
      await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

    if (certificateError) {
      console.error(
        "CERTIFICATE CHECK ERROR:",
        certificateError
      );

      return NextResponse.json(
        { error: "Unable to check certificate." },
        { status: 500 }
      );
    }

    /*
     * CREATE CERTIFICATE RECORD IF NEEDED
     */

    if (!certificate) {
      const year = new Date().getFullYear();

      const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const certificateNumber =
        `DML-${course.slug.toUpperCase()}-${year}-${randomPart}`;

      const { data: newCertificate, error: insertError } =
        await supabase
          .from("certificates")
          .insert({
            user_id: user.id,
            course_id: courseId,
            certificate_number: certificateNumber,
          })
          .select("*")
          .single();

      if (insertError || !newCertificate) {
        console.error(
          "CERTIFICATE INSERT ERROR:",
          insertError
        );

        return NextResponse.json(
          { error: "Unable to create certificate." },
          { status: 500 }
        );
      }

      certificate = newCertificate;
    }

    /*
     * ISSUE DATE
     */

    const issuedAt =
      certificate.issued_at
        ? new Date(certificate.issued_at)
        : new Date();

   /*
 * VERIFICATION URL
 */

const origin =
  process.env.NODE_ENV === "production"
    ? "https://devmechlab.vercel.app"
    : new URL(request.url).origin;

const verificationUrl =
  `${origin}/verify/${certificate.certificate_number}`;

console.log(
  "CERTIFICATE VERIFICATION URL:",
  verificationUrl
);
    /*
     * UPDATE QR CODE
     */

    const { error: qrUpdateError } =
      await supabase
        .from("certificates")
        .update({
          qr_code: verificationUrl,
        })
        .eq("id", certificate.id)
        .eq("user_id", user.id);

    if (qrUpdateError) {
      console.error(
        "QR UPDATE ERROR:",
        qrUpdateError
      );
    }

    /*
     * QR IMAGE
     */

    const qrDataUrl = await QRCode.toDataURL(
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
 * PDF
 */

const pdfDoc = await PDFDocument.create();

const page = pdfDoc.addPage([
  841.89,
  595.28,
]);

const width = page.getWidth();
const height = page.getHeight();

/*
 * FONTS
 */

const fontRegular = await pdfDoc.embedFont(
  StandardFonts.Helvetica
);

const fontBold = await pdfDoc.embedFont(
  StandardFonts.HelveticaBold
);

/*
 * COLORS
 */

const navy = rgb(0.02, 0.07, 0.16);
const blue = rgb(0.04, 0.32, 0.88);
const orange = rgb(1, 0.42, 0.05);
const gold = rgb(0.88, 0.63, 0.12);
const darkGold = rgb(0.62, 0.40, 0.05);
const white = rgb(0.98, 0.98, 0.98);
const gray = rgb(0.35, 0.38, 0.43);
const lightGray = rgb(0.92, 0.93, 0.95);

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
 * LOGO
 */

try {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "devmechlab_logo.png"
  );

  const logoBytes = await fs.readFile(logoPath);

  const logoImage = await pdfDoc.embedPng(
    logoBytes
  );

  const maxLogoWidth = 190;
  const maxLogoHeight = 90;

  const logoScale = Math.min(
    maxLogoWidth / logoImage.width,
    maxLogoHeight / logoImage.height
  );

  const logoWidth =
    logoImage.width * logoScale;

  const logoHeight =
    logoImage.height * logoScale;

  page.drawImage(logoImage, {
    x: (width - logoWidth) / 2,
    y: height - 115,
    width: logoWidth,
    height: logoHeight,
  });
} catch (logoError) {
  console.error(
    "LOGO ERROR:",
    logoError
  );

  page.drawText("DevMechLab", {
    x: 55,
    y: height - 75,
    size: 25,
    font: fontBold,
    color: blue,
  });
}

/*
 * CERTIFICATE NUMBER — TOP RIGHT
 */

page.drawText("CERTIFICATE NO.", {
  x: 675,
  y: height - 48,
  size: 8,
  font: fontBold,
  color: gray,
});

page.drawText(
  certificate.certificate_number,
  {
    x: 675,
    y: height - 65,
    size: 10,
    font: fontBold,
    color: blue,
  }
);

/*
 * TOP-LEFT MEDAL — REFERENCE IMAGE
 */

try {
  const medalPath = path.join(
    process.cwd(),
    "public",
    "images",
    "devmechlab-medal-reference.png"
  );

  const medalBytes =
    await fs.readFile(medalPath);

  const medalImage =
    await pdfDoc.embedPng(medalBytes);

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
 * BOTTOM-CENTER SEAL — R1C1
 */

try {
  const sealPath = path.join(
    process.cwd(),
    "public",
    "images",
    "devmechlab-bottom-center-seal.png"
  );

  const sealBytes = await fs.readFile(sealPath);

  const sealImage =
    await pdfDoc.embedPng(sealBytes);

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
 * TITLE
 */

const title = "CERTIFICATE";

const titleSize = 36;

const titleWidth =
  fontBold.widthOfTextAtSize(
    title,
    titleSize
  );

page.drawText(title, {
  x: (width - titleWidth) / 2,
  y: height - 185,
  size: titleSize,
  font: fontBold,
  color: navy,
});

/*
 * ORANGE SUBTITLE
 */

const subtitle = "OF COMPLETION";

const subtitleSize = 16;

const subtitleWidth =
  fontBold.widthOfTextAtSize(
    subtitle,
    subtitleSize
  );

page.drawText(subtitle, {
  x: (width - subtitleWidth) / 2,
  y: height - 210,
  size: subtitleSize,
  font: fontBold,
  color: orange,
});

/*
 * DECORATIVE LINES
 */

page.drawLine({
  start: { x: 205, y: height - 202 },
  end: { x: 315, y: height - 202 },
  thickness: 1,
  color: gold,
});

page.drawLine({
  start: { x: 527, y: height - 202 },
  end: { x: 637, y: height - 202 },
  thickness: 1,
  color: gold,
});

/*
 * THIS IS TO CERTIFY THAT
 */

const certifyText =
  "THIS IS TO CERTIFY THAT";

const certifySize = 10;

page.drawText(certifyText, {
  x:
    (width -
      fontRegular.widthOfTextAtSize(
        certifyText,
        certifySize
      )) /
    2,
  y: height - 245,
  size: certifySize,
  font: fontRegular,
  color: gray,
});

/*
 * STUDENT NAME
 */

const studentName =
  profile.full_name || "Student";

const studentSize = 30;

const studentWidth =
  fontBold.widthOfTextAtSize(
    studentName,
    studentSize
  );

page.drawText(studentName, {
  x:
    (width - studentWidth) / 2,
  y: height - 290,
  size: studentSize,
  font: fontBold,
  color: navy,
});

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
 * COURSE DURATION
 */

const durationValue =
  String(course.duration || "")
    .match(/\d+/)?.[0] ?? "";

const durationText = durationValue
  ? `${durationValue}-week`
  : "course";

/*
 * COURSE STATEMENTS
 */

const statement =
  `has successfully completed the ${durationText} course in ${course.title}`;

const statement2 =
  "and has demonstrated the required knowledge and skills";

const statement3 =
  "to complete the course with excellence.";

const statement4 =
  `from ${formatDate(
    new Date(enrollment.enrolled_at)
  )} to ${formatDate(issuedAt)}.`;

const statementSize = 11;

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

  page.drawText(text, {
    x: (width - textWidth) / 2,
    y,
    size,
    font,
    color,
  });
}

/*
 * STATEMENT POSITIONS
 *
 * Keep all four lines together with
 * enough space before the information strip.
 */

drawCenteredText(
  statement,
  height - 328,
  statementSize,
  fontRegular,
  navy
);

drawCenteredText(
  statement2,
  height - 346,
  statementSize,
  fontRegular,
  navy
);

drawCenteredText(
  statement3,
  height - 364,
  statementSize,
  fontRegular,
  navy
);

drawCenteredText(
  statement4,
  height - 382,
  statementSize,
  fontRegular,
  navy
);

/*
 * INFORMATION STRIP
 *
 * Positioned lower so it does not overlap
 * with the course statements.
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

for (let i = 1; i < columns; i++) {
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

  page.drawText(label, {
    x:
      center -
      labelWidth / 2,
    y: infoY + 39,
    size: labelSize,
    font: fontBold,
    color: gray,
  });

  page.drawText(value, {
    x:
      center -
      valueWidth / 2,
    y: infoY + 20,
    size: valueSize,
    font: fontBold,
    color: navy,
  });
}

/*
 * INFORMATION VALUES
 */

drawInfoColumn(
  0,
  "COURSE DURATION",
  durationValue
    ? `${durationValue} WEEKS`
    : "N/A"
);

drawInfoColumn(
  1,
  "COMPLETION DATE",
  formatDate(issuedAt)
);

drawInfoColumn(
  2,
  "COURSE MODE",
  "ONLINE"
);

drawInfoColumn(
  3,
  "LEVEL",
  "PROFESSIONAL"
);
/*
 * ISSUED DATE
 */

const issuedText =
  `Issued: ${formatDate(issuedAt)}`;

page.drawText(issuedText, {
  x: 55,
  y: 105,
  size: 10,
  font: fontBold,
  color: gray,
});

/*
 * QR CODE
 *
 * BELOW ISSUED DATE
 */

const qrImage =
  await pdfDoc.embedPng(qrBytes);

page.drawImage(qrImage, {
  x: 55,
  y: 42,
  width: 58,
  height: 58,
});

/*
 * QR LABEL
 */

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

page.drawText(verifyText, {
  x: (width - verifyWidth) / 2,
  y: 24,
  size: verifySize,
  font: fontRegular,
  color: gray,
});
    /*
     * SAVE PDF
     */

    const pdfBytes =
      await pdfDoc.save();

    /*
     * STORAGE PATH
     */

    const storagePath =
      `${user.id}/${certificate.certificate_number}.pdf`;

    const { error: uploadError } =
      await supabase.storage
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
        "CERTIFICATE UPLOAD ERROR:",
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
     * SAVE STORAGE PATH
     *
     * We store the path, not a public URL,
     * because the bucket is private.
     */

    const { error: updateError } =
      await supabase
        .from("certificates")
        .update({
          pdf_url: storagePath,
          qr_code: verificationUrl,
        })
        .eq("id", certificate.id)
        .eq("user_id", user.id);

    if (updateError) {
      console.error(
        "CERTIFICATE UPDATE ERROR:",
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

    return NextResponse.json({
      success: true,
      certificateNumber:
        certificate.certificate_number,
      pdfPath: storagePath,
      verificationUrl,
    });
  } catch (error) {
    console.error(
      "CERTIFICATE GENERATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Certificate generation failed.",
      },
      { status: 500 }
    );
  }
}

/*
 * DATE FORMAT
 */

function formatDate(date: Date) {
  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}
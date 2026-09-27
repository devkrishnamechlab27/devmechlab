import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CheckoutPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  /*
   * GET CURRENT USER
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * IF USER IS NOT LOGGED IN
   *
   * Preserve the checkout destination so that
   * after login the user returns here.
   */

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/checkout/${slug}`
      )}`
    );
  }

  /*
   * GET COURSE
   */

  const {
    data: course,
    error: courseError,
  } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    return notFound();
  }

  /*
   * CHECK EXISTING ENROLLMENT
   *
   * IMPORTANT:
   * This is a SERVER-SIDE protection.
   *
   * Even if the user manually enters:
   *
   * /checkout/python-programming
   *
   * an already-enrolled user will not see
   * the payment page.
   */

  const {
    data: enrollment,
    error: enrollmentError,
  } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  console.log(
    "CHECKOUT USER:",
    user.id
  );

  console.log(
    "CHECKOUT COURSE:",
    course.id,
    course.slug
  );

  console.log(
    "CHECKOUT ENROLLMENT:",
    enrollment
  );

  if (enrollmentError) {
    console.error(
      "CHECKOUT ENROLLMENT CHECK ERROR:",
      enrollmentError
    );
  }

  /*
   * ALREADY ENROLLED
   *
   * Do NOT allow the user to reach payment.
   */

  if (enrollment) {
    console.log(
      "ALREADY ENROLLED → REDIRECTING TO LEARN"
    );

    redirect(`/learn/${course.slug}`);
  }

  /*
   * NOT ENROLLED
   *
   * Continue to checkout normally.
   */

  console.log(
    "NOT ENROLLED → SHOWING CHECKOUT"
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-8">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* Left Side */}

        <div className="lg:col-span-2">

          <h1 className="text-5xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-400 mt-3">
            Complete your enrollment securely.
          </p>

          <div className="mt-10 bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <h2 className="text-3xl font-bold">
              {course.title}
            </h2>

            <p className="text-gray-400 mt-4">
              {course.description}
            </p>

            <div className="mt-8 space-y-4">

              <p>✅ Lifetime Access</p>

              <p>✅ QR Verified Certificate</p>

              <p>✅ Downloadable Resources</p>

              <p>✅ Real Industry Projects</p>

              <p>✅ Mobile & Desktop Access</p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 sticky top-24">

            <h2 className="text-4xl font-bold text-orange-400">
              {course.price}
            </h2>

            <PaymentButton course={course} />

            <p className="text-gray-500 text-sm mt-6 text-center">
              Secure checkout powered by DevMechLab
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}
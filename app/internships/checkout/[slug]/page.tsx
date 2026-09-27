import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import InternshipPaymentButton from "@/components/InternshipPaymentButton";

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
   * NOT LOGGED IN
   *
   * Preserve the correct internship checkout destination.
   */

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/internships/checkout/${slug}`
      )}`
    );
  }

  /*
   * GET INTERNSHIP
   */

  const {
    data: internship,
    error: internshipError,
  } = await supabase
    .from("internships")
    .select("*")
    .eq("slug", slug)
    .single();

  if (internshipError || !internship) {
    return notFound();
  }

  /*
   * CHECK EXISTING INTERNSHIP ENROLLMENT
   *
   * Prevent an already-enrolled user from
   * purchasing the same internship again.
   */

  const {
    data: enrollment,
    error: enrollmentError,
  } = await supabase
    .from("internship_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("internship_id", internship.id)
    .maybeSingle();

  console.log(
    "INTERNSHIP CHECKOUT USER:",
    user.id
  );

  console.log(
    "INTERNSHIP:",
    internship.id,
    internship.slug
  );

  console.log(
    "INTERNSHIP ENROLLMENT:",
    enrollment
  );

  console.log(
    "INTERNSHIP ENROLLMENT ERROR:",
    enrollmentError
  );

  if (enrollmentError) {
    console.error(
      "INTERNSHIP ENROLLMENT CHECK ERROR:",
      enrollmentError
    );
  }

  /*
   * ALREADY ENROLLED
   *
   * Send the user directly to learning.
   */

  if (enrollment) {
    console.log(
      "INTERNSHIP ALREADY ENROLLED → REDIRECTING TO LEARN"
    );

    redirect(
      `/internships/learn/${internship.slug}`
    );
  }

  /*
   * NOT ENROLLED
   *
   * Show checkout normally.
   */

  console.log(
    "INTERNSHIP NOT ENROLLED → SHOWING CHECKOUT"
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-8">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2">

          <h1 className="text-5xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-400 mt-3">
            Complete your internship enrollment securely.
          </p>

          <div className="mt-10 bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <h2 className="text-3xl font-bold">
              {internship.title}
            </h2>

            <p className="text-gray-400 mt-4">
              {internship.description}
            </p>

            <div className="mt-8 space-y-4">

              <p>✅ Industry-Oriented Internship</p>

              <p>✅ Internship Certificate</p>

              <p>✅ Letter of Recommendation</p>

              <p>✅ Real Industry Projects</p>

              <p>✅ Placement Guidance</p>

              <p>✅ Mobile & Desktop Access</p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 sticky top-24">

            <h2 className="text-4xl font-bold text-orange-400">
              {internship.price}
            </h2>

            <InternshipPaymentButton
              internship={internship}
            />

            <p className="text-gray-500 text-sm mt-6 text-center">
              Secure checkout powered by DevMechLab
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}
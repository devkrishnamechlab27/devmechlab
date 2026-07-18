"use client";

import Link from "next/link";

type Props = {
  fullName: string;
  email: string;
  college: string;
  branch: string;
  phone: string;
};

export default function ProfileCard({
  fullName,
  email,
 college,
  branch,
  phone,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
            {fullName ? fullName.charAt(0).toUpperCase() : "S"}
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {fullName || "Student"}
            </h2>

            <p className="text-gray-400">
              {email}
            </p>

          </div>

        </div>

        <Link
          href="/profile"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
        >
          Edit Profile
        </Link>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-slate-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">College</p>
          <p className="font-semibold mt-1">
            {college || "-"}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Branch</p>
          <p className="font-semibold mt-1">
            {branch || "-"}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Phone</p>
          <p className="font-semibold mt-1">
            {phone || "-"}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Account Status</p>
          <p className="text-green-400 font-semibold mt-1">
            🟢 Verified
          </p>
        </div>

      </div>

    </div>
  );
}
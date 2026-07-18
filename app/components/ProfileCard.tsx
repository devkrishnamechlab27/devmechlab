"use client";

import Link from "next/link";

type Props = {
  fullName: string;
  college: string;
  branch: string;
  phone: string;
};

export default function ProfileCard({
  fullName,
  college,
  branch,
  phone,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Profile
        </h2>

        <Link
          href="/profile"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          Edit Profile
        </Link>
      </div>

      <div className="space-y-3 text-gray-300">
        <p><strong>Name:</strong> {fullName || "-"}</p>
        <p><strong>College:</strong> {college || "-"}</p>
        <p><strong>Branch:</strong> {branch || "-"}</p>
        <p><strong>Phone:</strong> {phone || "-"}</p>
      </div>

    </div>
  );
}
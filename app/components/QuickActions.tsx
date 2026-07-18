"use client";

import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      icon: "📚",
      title: "Browse Courses",
      description: "Explore engineering and software courses.",
      href: "/courses",
      color: "hover:border-blue-500",
    },
    {
      icon: "💼",
      title: "Browse Internships",
      description: "Discover internship opportunities.",
      href: "/internships",
      color: "hover:border-green-500",
    },
    {
      icon: "🏆",
      title: "My Certificates",
      description: "Download your earned certificates.",
      href: "/certificates",
      color: "hover:border-yellow-500",
    },
    {
      icon: "🔒",
      title: "Change Password",
      description: "Update your account password.",
      href: "/profile/security",
      color: "hover:border-red-500",
    },
    {
      icon: "🚪",
      title: "Logout",
      description: "Sign out from your account.",
      href: "/logout",
      color: "hover:border-gray-500",
    },
    {
      icon: "❓",
      title: "Help & Support",
      description: "Documentation and support center.",
      href: "#",
      color: "hover:border-purple-500",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-8">
        Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${action.color}`}
          >
            <div className="text-4xl mb-4">
              {action.icon}
            </div>

            <h3 className="text-xl font-bold">
              {action.title}
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              {action.description}
            </p>
          </Link>
        ))}

      </div>

    </div>
  );
}
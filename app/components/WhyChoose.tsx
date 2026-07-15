const features = [
  {
    icon: "🎓",
    title: "Expert Mentors",
    description: "Learn from experienced professionals and industry experts.",
  },
  {
    icon: "🏭",
    title: "Industry Projects",
    description: "Work on practical projects inspired by real industrial challenges.",
  },
  {
    icon: "📜",
    title: "QR Verified Certificates",
    description: "Receive secure, verifiable certificates after successful completion.",
  },
  {
    icon: "💼",
    title: "Internship Opportunities",
    description: "Gain hands-on experience through structured internship programs.",
  },
  {
    icon: "📚",
    title: "Lifetime Learning",
    description: "Access your course materials anytime after enrollment.",
  },
  {
    icon: "🚀",
    title: "Career Support",
    description: "Resume guidance, interview preparation, and career mentoring.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-slate-950 text-white py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center">
          Why Choose <span className="text-blue-500">DevMechLab</span>?
        </h2>

        <p className="text-center text-gray-400 mt-4 mb-14">
          Everything you need to build practical engineering skills and advance your career.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-5xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
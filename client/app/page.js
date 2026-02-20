import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: '🎓',
      title: 'Expert Instructors',
      desc: 'Learn from industry professionals with real-world experience.',
    },
    {
      icon: '📱',
      title: 'Learn Anywhere',
      desc: 'Access your courses on any device, anytime, at your own pace.',
    },
    {
      icon: '🏆',
      title: 'Certificates',
      desc: 'Earn certificates upon completion to showcase your skills.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Students' },
    { value: '50+', label: 'Courses' },
    { value: '20+', label: 'Instructors' },
    { value: '4.8★', label: 'Avg Rating' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Learn Without Limits
          </h1>
          <p className="text-xl mb-10 text-indigo-100 max-w-2xl mx-auto">
            Explore courses taught by industry experts. Gain in-demand skills and
            advance your career today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/courses"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition"
            >
              Browse Courses
            </Link>
            <Link
              href="/register"
              className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-700 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-indigo-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose CourseSell?</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Everything you need to upskill and land your dream role.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-5xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-50 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="text-gray-500 mb-8">Join thousands of learners already on CourseSell.</p>
        <Link
          href="/courses"
          className="bg-indigo-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-indigo-700 transition"
        >
          Explore All Courses
        </Link>
      </section>
    </div>
  );
}

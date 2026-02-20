'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import allCourses from '../../../data/courses';
import PaymentButton from '../../../components/PaymentButton';
import { auth } from '../../../lib/api';

const levelColor = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function CourseDetailPage({ params }) {
  const [openSection, setOpenSection] = useState(0);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  const course = allCourses.find((c) => c._id === params.id);
  if (!course) notFound();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    auth.me()
      .then(({ data }) => {
        const owned = data.purchasedCourses?.some(
          (c) => (c._id || c) === params.id
        );
        setAlreadyPurchased(owned);
      })
      .catch(() => {});
  }, [params.id]);

  const totalLectures = course.curriculum?.reduce(
    (sum, s) => sum + s.lectures.length,
    0
  ) ?? 0;

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <p className="text-indigo-400 text-sm mb-3">
              {course.category} &rsaquo; {course.level}
            </p>

            <h1 className="text-3xl font-bold mb-4 leading-tight">{course.title}</h1>
            <p className="text-gray-300 mb-5 leading-relaxed">{course.description}</p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
              <span className="text-yellow-400 font-bold">⭐ {course.rating}</span>
              <span className="text-gray-300">
                ({course.students?.toLocaleString()} students)
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor[course.level]}`}
              >
                {course.level}
              </span>
            </div>

            <p className="text-gray-400 text-sm">
              Created by{' '}
              <span className="text-indigo-400 font-medium">{course.instructor}</span>
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
              <span>🕐 {course.duration} total</span>
              <span>📚 {course.lessons} lessons</span>
              <span>🏷 Last updated 2025</span>
            </div>
          </div>

          {/* Purchase card — visible on lg inside hero */}
          <div className="hidden lg:block">
            <PurchaseCard course={course} alreadyPurchased={alreadyPurchased} />
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">

          {/* What you'll learn */}
          {course.whatYouLearn?.length > 0 && (
            <section className="border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5">What you&apos;ll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✔</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course Curriculum */}
          {course.curriculum?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-2">Course Content</h2>
              <p className="text-gray-500 text-sm mb-5">
                {course.curriculum.length} sections &bull; {totalLectures} lectures &bull;{' '}
                {course.duration} total length
              </p>
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                {course.curriculum.map((section, idx) => (
                  <div key={idx}>
                    <button
                      onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                    >
                      <span className="font-semibold text-gray-800">{section.section}</span>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{section.lectures.length} lectures</span>
                        <span>{openSection === idx ? '▲' : '▼'}</span>
                      </div>
                    </button>
                    {openSection === idx && (
                      <ul className="divide-y divide-gray-100">
                        {section.lectures.map((lecture, li) => (
                          <li
                            key={li}
                            className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600"
                          >
                            <span className="text-indigo-400">▶</span>
                            {lecture}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req) => (
                  <li key={req} className="flex gap-3 items-start text-sm text-gray-600">
                    <span className="text-gray-400 flex-shrink-0">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Instructor */}
          <section>
            <h2 className="text-xl font-bold mb-4">Your Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-indigo-600 text-lg">{course.instructor}</h3>
                <p className="text-gray-500 text-sm mt-1">{course.instructorBio}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Purchase card — sticky on desktop, visible below content on mobile */}
        <div className="lg:hidden">
          <PurchaseCard course={course} alreadyPurchased={alreadyPurchased} />
        </div>
        <div className="hidden lg:block">
          {/* spacer — card is shown in hero on desktop */}
        </div>
      </div>
    </div>
  );
}

function PurchaseCard({ course, alreadyPurchased }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full rounded-xl mb-5 object-cover"
      />

      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl font-bold text-gray-900">₹{course.price}</span>
      </div>
      <p className="text-gray-400 text-xs mb-5">
        One-time payment &bull; Lifetime access
      </p>

      <PaymentButton course={course} alreadyPurchased={alreadyPurchased} />

      <p className="text-center text-gray-400 text-xs mt-3">
        30-day money-back guarantee
      </p>

      <ul className="mt-5 space-y-2 text-sm text-gray-600 border-t pt-4">
        <li className="flex gap-2">
          <span>📱</span> Access on mobile &amp; desktop
        </li>
        <li className="flex gap-2">
          <span>♾️</span> Full lifetime access
        </li>
        <li className="flex gap-2">
          <span>📚</span> {course.lessons} on-demand lessons
        </li>
        <li className="flex gap-2">
          <span>🕐</span> {course.duration} of content
        </li>
        <li className="flex gap-2">
          <span>🏆</span> Certificate of completion
        </li>
      </ul>

      {/* Tags */}
      {course.tags?.length > 0 && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

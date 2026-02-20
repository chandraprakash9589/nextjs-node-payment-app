'use client';

import { useState, useMemo } from 'react';
import allCourses from '../../data/courses';
import CourseCard from '../../components/CourseCard';

const CATEGORIES = ['', 'Frontend', 'Backend', 'DevOps'];
const LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      const matchSearch = search
        ? c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        : true;
      const matchCategory = category ? c.category === category : true;
      const matchLevel = level ? c.level === level : true;
      return matchSearch && matchCategory && matchLevel;
    });
  }, [search, category, level]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">All Courses</h1>
      <p className="text-gray-500 mb-8">
        {allCourses.length} courses to help you level up your skills
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 flex-1 min-w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c || 'All Categories'}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l || 'All Levels'}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">No courses found for your search.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{filtered.length} courses found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

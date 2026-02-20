import Link from 'next/link';

export default function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course._id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden block group"
    >
      <div className="relative h-48 bg-indigo-100 overflow-hidden">
        <img
          src={
            course.thumbnail ||
            `https://placehold.co/400x225/6366f1/ffffff?text=${encodeURIComponent(course.title)}`
          }
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 right-3 bg-white text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full shadow">
          {course.level}
        </span>
      </div>

      <div className="p-5">
        <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
          {course.category}
        </span>
        <h3 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>

        <div className="flex items-center text-xs text-gray-400 gap-3 mb-4">
          <span>⏱ {course.duration}</span>
          <span>📚 {course.lessons} lessons</span>
          <span>⭐ {course.rating}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-indigo-600 font-bold text-lg">₹{course.price}</span>
          <span className="text-gray-400 text-xs">
            {course.students?.toLocaleString()} students
          </span>
        </div>
      </div>
    </Link>
  );
}

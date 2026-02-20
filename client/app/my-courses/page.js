'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, payment } from '../../lib/api';

export default function MyCoursesPage() {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('courses'); // 'courses' | 'orders'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    Promise.all([auth.me(), payment.getOrders()])
      .then(([userRes, ordersRes]) => {
        setPurchasedCourses(userRes.data.purchasedCourses || []);
        setOrders(ordersRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {['courses', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              tab === t
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'courses' ? 'My Courses' : 'Order History'}
          </button>
        ))}
      </div>

      {/* Purchased Courses Tab */}
      {tab === 'courses' && (
        <>
          {purchasedCourses.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg mb-4">
                You haven&apos;t purchased any courses yet.
              </p>
              <Link
                href="/courses"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✅ Enrolled
                      </span>
                      <Link
                        href={`/courses/${course._id}`}
                        className="text-indigo-600 text-sm font-medium hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-20 text-lg">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4"
                >
                  {order.course?.thumbnail && (
                    <img
                      src={order.course.thumbnail}
                      alt={order.course.title}
                      className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {order.course?.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-300 mt-1 truncate">
                      ID: {order.razorpayPaymentId || order.razorpayOrderId}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-indigo-600">₹{order.amount}</p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'failed'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

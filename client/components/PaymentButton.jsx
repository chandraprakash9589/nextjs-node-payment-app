'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { payment } from '../lib/api';

// Dynamically loads the Razorpay checkout script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentButton({ course, alreadyPurchased }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (alreadyPurchased) {
    return (
      <div className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-center">
        ✅ Already Purchased
      </div>
    );
  }

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Create order on server
      const { data } = await payment.createOrder(course._id);

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,          // in paise
        currency: data.currency,
        name: 'CourseSell',
        description: `Purchase: ${data.courseName}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on server
            await payment.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
            });
            alert('Payment successful! Course added to your library.');
            router.push('/my-courses');
          } catch {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg"
    >
      {loading ? 'Processing...' : `Buy Now — ₹${course.price}`}
    </button>
  );
}

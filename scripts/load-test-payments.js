import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('payment_errors');
const paymentResponseTime = new Trend('payment_response_time');

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 200 },
    { duration: '5m', target: 500 },
    { duration: '10m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    payment_errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  // Test payment initiation
  let paymentRes = http.post(
    `${BASE_URL}/api/payments/initiate`,
    JSON.stringify({
      amount: Math.random() * 5000 + 100,
      currency: 'NGN',
      method: 'card',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'payment_initiate' },
    }
  );

  check(paymentRes, {
    'payment initiation success': (r) => r.status === 200,
    'payment response < 1s': (r) => r.timings.duration < 1000,
  });

  errorRate.add(paymentRes.status !== 200);
  paymentResponseTime.add(paymentRes.timings.duration);

  sleep(3);

  // Test payment status check
  let statusRes = http.get(`${BASE_URL}/api/payments/status/test-${Date.now()}`, {
    tags: { endpoint: 'payment_status' },
  });

  check(statusRes, {
    'status check success': (r) => r.status === 200 || r.status === 404,
  });

  sleep(2);
}

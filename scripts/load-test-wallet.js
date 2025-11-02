import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const walletResponseTime = new Trend('wallet_response_time');
const transactionCounter = new Counter('transactions');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 500 }, // Ramp up to 500 users
    { duration: '5m', target: 1000 }, // Ramp up to 1000 users
    { duration: '10m', target: 1000 }, // Stay at 1000 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    errors: ['rate<0.1'],
    'http_req_duration{endpoint:wallet}': ['p(95)<300'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  // Test wallet balance check
  let balanceRes = http.get(`${BASE_URL}/api/wallet/balance`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'wallet' },
  });

  check(balanceRes, {
    'balance check status 200': (r) => r.status === 200,
    'balance response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(balanceRes.status !== 200);
  walletResponseTime.add(balanceRes.timings.duration);

  sleep(1);

  // Test wallet transaction
  let transactionRes = http.post(
    `${BASE_URL}/api/wallet/transfer`,
    JSON.stringify({
      amount: Math.random() * 1000,
      recipient: `user_${Math.floor(Math.random() * 10000)}`,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'transaction' },
    }
  );

  check(transactionRes, {
    'transaction status 200': (r) => r.status === 200,
    'transaction response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(transactionRes.status !== 200);
  transactionCounter.add(1);

  sleep(2);
}

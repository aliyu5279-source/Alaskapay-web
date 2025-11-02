import { test, expect, Page } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173');
  });

  test.describe('User Registration and Onboarding', () => {
    test('should complete full signup flow', async () => {
      // Navigate to signup
      await page.click('text=Sign Up');
      
      // Fill registration form
      await page.fill('input[name="email"]', 'newuser@example.com');
      await page.fill('input[name="password"]', 'SecurePass123!');
      await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      
      // Accept terms
      await page.check('input[name="acceptTerms"]');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify email verification prompt
      await expect(page.locator('text=Verify your email')).toBeVisible();
      
      // Simulate email verification (in real test, would use email API)
      await page.goto('http://localhost:5173/verify-email?token=test-token');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('text=Welcome, John')).toBeVisible();
    });

    test('should handle registration errors', async () => {
      await page.click('text=Sign Up');
      
      // Try with existing email
      await page.fill('input[name="email"]', 'existing@example.com');
      await page.fill('input[name="password"]', 'Pass123!');
      await page.fill('input[name="confirmPassword"]', 'Pass123!');
      
      await page.click('button[type="submit"]');
      
      // Should show error
      await expect(page.locator('text=Email already registered')).toBeVisible();
    });
  });

  test.describe('Payment Processing', () => {
    test('should complete wallet top-up', async () => {
      // Login first
      await loginUser(page);
      
      // Navigate to wallet
      await page.click('text=Wallet');
      
      // Click top-up
      await page.click('button:has-text("Top Up")');
      
      // Enter amount
      await page.fill('input[name="amount"]', '5000');
      
      // Select payment method
      await page.click('text=Card Payment');
      
      // Fill card details
      await page.fill('input[name="cardNumber"]', '4242424242424242');
      await page.fill('input[name="expiry"]', '12/25');
      await page.fill('input[name="cvc"]', '123');
      
      // Submit payment
      await page.click('button:has-text("Pay ₦5,000")');
      
      // Wait for processing
      await expect(page.locator('text=Processing payment')).toBeVisible();
      
      // Verify success
      await expect(page.locator('text=Payment successful')).toBeVisible();
      await expect(page.locator('[data-testid="wallet-balance"]')).toContainText('5,000');
    });

    test('should handle 3DS authentication', async () => {
      await loginUser(page);
      
      // Navigate to payment
      await page.click('text=Wallet');
      await page.click('button:has-text("Top Up")');
      
      // Enter high amount (triggers 3DS)
      await page.fill('input[name="amount"]', '500000');
      
      // Fill card details
      await page.fill('input[name="cardNumber"]', '4000002500003155'); // 3DS test card
      await page.fill('input[name="expiry"]', '12/25');
      await page.fill('input[name="cvc"]', '123');
      
      await page.click('button:has-text("Pay")');
      
      // Handle 3DS modal
      await expect(page.locator('text=Authenticate Payment')).toBeVisible();
      
      // Complete 3DS (in test environment)
      await page.click('button:has-text("Authenticate")');
      
      // Verify success
      await expect(page.locator('text=Payment authenticated')).toBeVisible();
    });
  });

  test.describe('Subscription Management', () => {
    test('should purchase subscription plan', async () => {
      await loginUser(page);
      
      // Navigate to subscriptions
      await page.click('text=Subscriptions');
      
      // Select plan
      await page.click('[data-testid="plan-premium"]');
      
      // Review details
      await expect(page.locator('text=Premium Plan')).toBeVisible();
      await expect(page.locator('text=₦10,000/month')).toBeVisible();
      
      // Confirm purchase
      await page.click('button:has-text("Subscribe")');
      
      // Select payment method
      await page.click('text=Use saved card ending in 4242');
      
      // Confirm
      await page.click('button:has-text("Confirm Payment")');
      
      // Verify subscription active
      await expect(page.locator('text=Subscription Active')).toBeVisible();
      await expect(page.locator('[data-testid="current-plan"]')).toContainText('Premium');
    });

    test('should pause and resume subscription', async () => {
      await loginUser(page);
      
      // Navigate to subscription settings
      await page.click('text=Subscriptions');
      await page.click('text=Manage Subscription');
      
      // Pause subscription
      await page.click('button:has-text("Pause Subscription")');
      
      // Select resume date
      await page.fill('input[name="resumeDate"]', '2024-02-01');
      
      // Confirm pause
      await page.click('button:has-text("Confirm Pause")');
      
      // Verify paused status
      await expect(page.locator('text=Subscription Paused')).toBeVisible();
      
      // Resume subscription
      await page.click('button:has-text("Resume Now")');
      
      // Verify active again
      await expect(page.locator('text=Subscription Active')).toBeVisible();
    });
  });

  test.describe('KYC Verification', () => {
    test('should complete KYC verification', async () => {
      await loginUser(page);
      
      // Navigate to KYC
      await page.click('text=Verify Account');
      
      // Start verification
      await page.click('button:has-text("Start Verification")');
      
      // Step 1: Personal Information
      await page.fill('input[name="dateOfBirth"]', '1990-01-01');
      await page.fill('input[name="address"]', '123 Main St');
      await page.fill('input[name="city"]', 'Lagos');
      await page.fill('input[name="postalCode"]', '100001');
      await page.click('button:has-text("Next")');
      
      // Step 2: Document Upload
      const idFront = await page.locator('input[name="idFront"]');
      await idFront.setInputFiles('./test-assets/id-front.jpg');
      
      const idBack = await page.locator('input[name="idBack"]');
      await idBack.setInputFiles('./test-assets/id-back.jpg');
      
      await page.click('button:has-text("Next")');
      
      // Step 3: Liveness Check
      await page.click('button:has-text("Start Camera")');
      
      // Simulate liveness check
      await page.waitForTimeout(2000);
      await page.click('button:has-text("Capture")');
      
      // Submit verification
      await page.click('button:has-text("Submit Verification")');
      
      // Verify submission success
      await expect(page.locator('text=Verification Submitted')).toBeVisible();
      await expect(page.locator('text=Under Review')).toBeVisible();
    });
  });

  test.describe('Money Transfer', () => {
    test('should send money to another user', async () => {
      await loginUser(page);
      
      // Navigate to transfer
      await page.click('text=Send Money');
      
      // Enter recipient
      await page.fill('input[name="recipient"]', 'recipient@example.com');
      
      // Enter amount
      await page.fill('input[name="amount"]', '1000');
      
      // Add note
      await page.fill('textarea[name="note"]', 'Payment for services');
      
      // Review transfer
      await page.click('button:has-text("Continue")');
      
      // Verify details
      await expect(page.locator('text=Transfer Details')).toBeVisible();
      await expect(page.locator('text=₦1,000')).toBeVisible();
      await expect(page.locator('text=recipient@example.com')).toBeVisible();
      
      // Confirm transfer
      await page.click('button:has-text("Confirm Transfer")');
      
      // Enter PIN
      await page.fill('input[name="pin"]', '1234');
      await page.click('button:has-text("Authorize")');
      
      // Verify success
      await expect(page.locator('text=Transfer Successful')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-id"]')).toBeVisible();
    });
  });
});

// Helper function to login
async function loginUser(page: Page) {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}
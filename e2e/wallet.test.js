describe('Wallet Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display wallet balance', async () => {
    await expect(element(by.id('wallet-balance'))).toBeVisible();
  });

  it('should open top-up modal', async () => {
    await element(by.id('top-up-button')).tap();
    await expect(element(by.id('top-up-modal'))).toBeVisible();
  });

  it('should validate top-up amount', async () => {
    await element(by.id('top-up-button')).tap();
    await element(by.id('amount-input')).typeText('100\n');
    await element(by.id('submit-button')).tap();
    await expect(element(by.text('Amount must be at least ₦500'))).toBeVisible();
  });

  it('should open transfer modal', async () => {
    await element(by.id('transfer-button')).tap();
    await expect(element(by.id('transfer-modal'))).toBeVisible();
  });

  it('should display transaction history', async () => {
    await element(by.id('transactions-tab')).tap();
    await expect(element(by.id('transaction-list'))).toBeVisible();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletCard } from '../WalletCard';

// Mock the context
vi.mock('../../contexts/AppContext', () => ({
  useApp: () => ({
    currency: 'NGN',
    exchangeRates: { NGN: 1, USD: 0.0013, GBP: 0.0010, EUR: 0.0012 },
  }),
}));

describe('WalletCard', () => {
  it('renders wallet balance correctly', () => {
    render(<WalletCard balance={50000} />);
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
  });

  it('displays currency symbol', () => {
    render(<WalletCard balance={50000} />);
    expect(screen.getByText(/₦/)).toBeInTheDocument();
  });

  it('shows wallet actions', () => {
    render(<WalletCard balance={50000} />);
    expect(screen.getByText(/Top Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfer/i)).toBeInTheDocument();
    expect(screen.getByText(/Withdraw/i)).toBeInTheDocument();
  });
});

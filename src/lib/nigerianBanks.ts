export interface NigerianBank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  { id: '1', name: 'Access Bank', code: '044' },
  { id: '2', name: 'GTBank (Guaranty Trust Bank)', code: '058' },
  { id: '3', name: 'First Bank of Nigeria', code: '011' },
  { id: '4', name: 'United Bank for Africa (UBA)', code: '033' },
  { id: '5', name: 'Zenith Bank', code: '057' },
  { id: '6', name: 'Fidelity Bank', code: '070' },
  { id: '7', name: 'Union Bank', code: '032' },
  { id: '8', name: 'Stanbic IBTC Bank', code: '221' },
  { id: '9', name: 'Sterling Bank', code: '232' },
  { id: '10', name: 'Polaris Bank', code: '076' },
  { id: '11', name: 'Wema Bank', code: '035' },
  { id: '12', name: 'Ecobank Nigeria', code: '050' },
  { id: '13', name: 'FCMB (First City Monument Bank)', code: '214' },
  { id: '14', name: 'Keystone Bank', code: '082' },
  { id: '15', name: 'Kuda Bank', code: '50211' },
  { id: '16', name: 'Opay', code: '999992' },
  { id: '17', name: 'PalmPay', code: '999991' },
  { id: '18', name: 'Moniepoint', code: '50515' },
  { id: '19', name: 'VFD Microfinance Bank', code: '566' },
  { id: '20', name: 'Providus Bank', code: '101' },
];

export const getBankByCode = (code: string) => {
  return NIGERIAN_BANKS.find(bank => bank.code === code);
};

export const getBankById = (id: string) => {
  return NIGERIAN_BANKS.find(bank => bank.id === id);
};

import { useState, useEffect } from 'react';
import { mfaService } from '@/services/mfaService';

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  requiresMFA: boolean;
  factors: string[];
}

export function useRiskBasedAuth() {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessRisk();
  }, []);

  const assessRisk = async () => {
    setLoading(true);
    try {
      const score = await mfaService.calculateRiskScore();
      const factors: string[] = [];
      
      if (score >= 50) factors.push('Unrecognized device');
      if (score >= 30) factors.push('Recent failed login attempts');
      
      const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
      const requiresMFA = score >= 40;

      setRiskAssessment({
        score,
        level,
        requiresMFA,
        factors
      });
    } catch (error) {
      console.error('Risk assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { riskAssessment, loading, assessRisk };
}

import { supabase } from './supabase';

export interface ASOKeyword {
  id: string;
  keyword: string;
  platform: 'ios' | 'android' | 'both';
  current_rank?: number;
  previous_rank?: number;
  search_volume: number;
  difficulty_score: number;
  relevance_score: number;
  is_primary: boolean;
  tracking_enabled: boolean;
}

export interface ASOCompetitor {
  id: string;
  app_name: string;
  app_id: string;
  platform: 'ios' | 'android';
  current_rank?: number;
  rating: number;
  review_count: number;
  download_estimate: number;
}

export interface ASOABTest {
  id: string;
  test_name: string;
  test_type: 'screenshot' | 'description' | 'icon' | 'title' | 'subtitle';
  platform: 'ios' | 'android' | 'both';
  variant_a: any;
  variant_b: any;
  status: 'draft' | 'running' | 'paused' | 'completed';
  impressions_a: number;
  impressions_b: number;
  conversions_a: number;
  conversions_b: number;
  confidence_level?: number;
  winner?: 'a' | 'b' | 'inconclusive';
}

export const asoService = {
  async getKeywords(platform?: string) {
    let query = supabase.from('aso_keywords').select('*').order('relevance_score', { ascending: false });
    if (platform) query = query.eq('platform', platform);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async trackKeyword(keyword: Partial<ASOKeyword>) {
    const { data, error } = await supabase.from('aso_keywords').insert(keyword).select().single();
    if (error) throw error;
    return data;
  },

  async updateKeywordRank(keywordId: string, rank: number) {
    const { data: keyword } = await supabase.from('aso_keywords').select('current_rank').eq('id', keywordId).single();
    
    await supabase.from('aso_keywords').update({
      previous_rank: keyword?.current_rank,
      current_rank: rank,
      last_checked_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq('id', keywordId);

    await supabase.from('aso_keyword_history').insert({
      keyword_id: keywordId,
      rank,
      recorded_at: new Date().toISOString()
    });
  },

  async getCompetitors(platform?: string) {
    let query = supabase.from('aso_competitors').select('*').order('current_rank', { ascending: true });
    if (platform) query = query.eq('platform', platform);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getABTests(status?: string) {
    let query = supabase.from('aso_ab_tests').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getConversionMetrics(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('aso_conversion_metrics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getRecommendations(status?: string) {
    let query = supabase.from('aso_recommendations').select('*').order('impact_score', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  calculateVisibilityScore(keywords: ASOKeyword[]): number {
    if (keywords.length === 0) return 0;
    const rankedKeywords = keywords.filter(k => k.current_rank);
    const totalScore = rankedKeywords.reduce((sum, k) => {
      const rankScore = Math.max(0, 100 - (k.current_rank || 100));
      return sum + (rankScore * k.search_volume * k.relevance_score) / 10000;
    }, 0);
    return Math.min(100, totalScore / keywords.length);
  }
};

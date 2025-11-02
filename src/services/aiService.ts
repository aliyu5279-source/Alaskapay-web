import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIInsight {
  type: 'spending' | 'saving' | 'warning' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
}

export const aiService = {
  async chat(messages: ChatMessage[], context?: any) {
    const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
      body: { messages, context }
    });
    
    if (error) throw error;
    return data;
  },

  async categorizeTransaction(description: string, amount: number) {
    const prompt = `Categorize this transaction: "${description}" ($${amount}). 
    Return only the category: Food, Transport, Shopping, Bills, Entertainment, Healthcare, or Other.`;
    
    const response = await this.chat([
      { role: 'user', content: prompt }
    ]);
    
    return response.message.trim();
  },

  async generateFinancialInsights(transactions: any[]): Promise<AIInsight[]> {
    const summary = transactions.slice(0, 50).map(t => 
      `${t.type}: $${t.amount} - ${t.description}`
    ).join('\n');

    const prompt = `Analyze these transactions and provide 3-5 financial insights:
    ${summary}
    
    Format: JSON array with {type, title, description, confidence}`;

    const response = await this.chat([
      { role: 'user', content: prompt }
    ]);

    try {
      return JSON.parse(response.message);
    } catch {
      return [];
    }
  },

  async detectFraudRisk(transaction: any): Promise<number> {
    const prompt = `Rate fraud risk (0-100) for: $${transaction.amount} to ${transaction.recipient} 
    from ${transaction.location}. Consider: unusual amount, new recipient, location anomaly.`;

    const response = await this.chat([
      { role: 'user', content: prompt }
    ]);

    const match = response.message.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
};
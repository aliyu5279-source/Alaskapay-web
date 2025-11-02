import { supabase } from '@/lib/supabase';

export const savePaystackCardToSupabase = async (
  userId: string,
  authData: any
) => {
  try {
    // Extract values from Paystack response
    const cardData = {
      user_id: userId,
      paystack_authorization_code: authData.authorization.authorization_code,
      card_type: authData.authorization.card_type,
      last4: authData.authorization.last4,
      exp_month: authData.authorization.exp_month,
      exp_year: authData.authorization.exp_year,
      bank: authData.authorization.bank,
      brand: authData.authorization.brand,
      is_default: false, // Will update to true for the first card only
    };

    // Check if this is the user's first card
    const { data: existingCards, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    if (!existingCards || existingCards.length === 0) {
      cardData.is_default = true; // First card becomes default
    }

    // Save card in Supabase
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert(cardData);

    if (insertError) throw insertError;

    console.log('✅ Card saved to Supabase:', cardData);
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving card:', error);
    return { success: false, error };
  }
};
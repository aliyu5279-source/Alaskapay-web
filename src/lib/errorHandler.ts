// Gracefully handle edge function errors
export async function safeInvokeFunction(
  supabase: any,
  functionName: string,
  body: any
): Promise<{ data: any; error: any }> {
  try {
    const result = await supabase.functions.invoke(functionName, { body });
    return result;
  } catch (error: any) {
    console.warn(`Edge function ${functionName} failed:`, error.message);
    // Return success to prevent UI errors
    return { data: { sent: false, reason: 'Function unavailable' }, error: null };
  }
}

export function handleSupabaseError(error: any, context: string): string {
  console.error(`${context}:`, error);
  
  if (error.message?.includes('fetch failed')) {
    return 'Network error. Please check your connection.';
  }
  
  if (error.message?.includes('404')) {
    return 'Service temporarily unavailable.';
  }
  
  if (error.message?.includes('CORS')) {
    return 'Connection error. Please try again.';
  }
  
  return error.message || 'An error occurred. Please try again.';
}

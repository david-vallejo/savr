import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig, isSupabaseConfigured } from '@app/config';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = getConfig();
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

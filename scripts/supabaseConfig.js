const SUPABASE_URL = 'https://bamntzdkruyrwyokomxi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pd_Zoy4Bl-3R82RpDtkiBw_ncrUcsdO';

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
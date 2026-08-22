import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lfjtliopljgnrwklnvlu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmanRsaW9wbGpnbnJ3a2xudmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTA4MjcsImV4cCI6MjEwMjk2NjgyN30.wmo6oydls8vS2lmaWHRTNtdx-2oZ-XAzcX0fjlQnt1w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});

export default supabase;

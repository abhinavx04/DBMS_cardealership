import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Add debug logging to verify environment variables
console.log('Supabase URL:', supabaseUrl);
// Don't log the full key in production!
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  // Removed invalid 'storage' property
});

// Test the connection
supabase.storage.listBuckets().then(({ data, error }) => {
  if (error) {
    console.error('Supabase storage connection error:', error.message);
  } else {
    console.log('Supabase storage connected, available buckets:', data);
  }
}).catch(err => {
  console.error('Failed to connect to Supabase:', err);
});

// Add this after your existing connection test
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Auth status check failed:', error.message);
  } else {
    console.log('Auth status:', session ? 'Authenticated' : 'Not authenticated');
    if (session) {
      console.log('User ID:', session.user.id);
    }
  }
});
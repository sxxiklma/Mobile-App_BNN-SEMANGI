import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://izpnubluaeboflbdqenw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cG51Ymx1YWVib2ZsYmRxZW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzM5MjcsImV4cCI6MjA4MjY0OTkyN30.0XtIvKxRBvDMI3LwMkF7gF7VtC9rqrUJGv2YmzT7yno';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bucket name untuk foto
export const STORAGE_BUCKET = 'bnn-photos';

// Initialize storage bucket (jalankan sekali)
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      // Create bucket if doesn't exist
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true, // Public bucket untuk foto
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      });
      
      if (error) {
        console.error('❌ Error creating bucket:', error);
        return false;
      }
      
      console.log('✅ Storage bucket created:', STORAGE_BUCKET);
    } else {
      console.log('✅ Storage bucket already exists:', STORAGE_BUCKET);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
    return false;
  }
};

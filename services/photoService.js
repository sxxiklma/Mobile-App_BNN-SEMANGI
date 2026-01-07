import { supabase, STORAGE_BUCKET } from '../config/supabase';

/**
 * Upload foto ke Supabase Storage
 * @param {string} filePath - Path file di storage (contoh: 'logos/logo_bnn.png')
 * @param {File|Blob} file - File atau Blob yang akan diupload
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadPhoto = async (filePath, file) => {
  try {
    console.log('🔵 Uploading photo to Supabase:', filePath);

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });

    if (error) {
      console.error('❌ Error uploading photo:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    console.log('✅ Photo uploaded successfully:', urlData.publicUrl);
    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('❌ Exception uploading photo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get public URL untuk foto
 * @param {string} filePath - Path file di storage
 * @returns {string} Public URL
 */
export const getPhotoUrl = (filePath) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Delete foto dari Supabase Storage
 * @param {string} filePath - Path file di storage
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deletePhoto = async (filePath) => {
  try {
    console.log('🔵 Deleting photo from Supabase:', filePath);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting photo:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Photo deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Exception deleting photo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * List semua foto di folder tertentu
 * @param {string} folderPath - Path folder (contoh: 'logos')
 * @returns {Promise<Array>}
 */
export const listPhotos = async (folderPath = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath);

    if (error) {
      console.error('❌ Error listing photos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception listing photos:', error);
    return [];
  }
};

/**
 * Upload foto dari assets folder ke Supabase
 * Helper function untuk migrasi foto dari local ke cloud
 */
export const uploadAssetPhoto = async (fileName, fileBlob) => {
  const filePath = `assets/${fileName}`;
  return uploadPhoto(filePath, fileBlob);
};

// URL untuk foto-foto yang sudah diupload
export const PHOTO_URLS = {
  LOGO_BNN: getPhotoUrl('assets/logo_bnn.png'),
  // Tambahkan foto lain di sini setelah upload
};

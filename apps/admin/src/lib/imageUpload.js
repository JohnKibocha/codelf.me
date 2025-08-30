import { storage } from './appwrite/appwrite';
import { ID } from 'appwrite';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'images';

/**
 * Upload image to Appwrite storage and return the URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${ID.unique()}.${fileExtension}`;

    // Upload to Appwrite storage
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
    
    // Get the file URL
    const fileUrl = storage.getFileView(BUCKET_ID, response.$id);
    
    return fileUrl.href;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

/**
 * Handle image upload from file input or URL
 * @param {Function} editor - TipTap editor instance
 * @param {Function} showSnackbar - Snackbar function for notifications
 */
export const handleImageUpload = async (editor, showSnackbar) => {
  // Create modal for image input
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Image</h3>
      
      <!-- Tab buttons -->
      <div class="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button id="upload-tab" class="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">Upload File</button>
        <button id="url-tab" class="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">URL</button>
      </div>
      
      <!-- Upload tab content -->
      <div id="upload-content">
        <input type="file" id="image-file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"/>
        <p class="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPEG, PNG, GIF, WebP</p>
      </div>
      
      <!-- URL tab content -->
      <div id="url-content" class="hidden">
        <input type="url" id="image-url" placeholder="https://example.com/image.jpg" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
        <p class="text-xs text-gray-500 mt-2">Enter a direct link to an image</p>
      </div>
      
      <!-- Alt text -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alt text (optional)</label>
        <input type="text" id="alt-text" placeholder="Describe the image..." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
      </div>
      
      <!-- Buttons -->
      <div class="flex justify-end gap-3 mt-6">
        <button id="cancel-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
        <button id="insert-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Insert Image</button>
      </div>
      
      <!-- Loading state -->
      <div id="loading" class="hidden text-center mt-4">
        <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Uploading image...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const uploadTab = modal.querySelector('#upload-tab');
  const urlTab = modal.querySelector('#url-tab');
  const uploadContent = modal.querySelector('#upload-content');
  const urlContent = modal.querySelector('#url-content');
  const fileInput = modal.querySelector('#image-file');
  const urlInput = modal.querySelector('#image-url');
  const altInput = modal.querySelector('#alt-text');
  const insertBtn = modal.querySelector('#insert-btn');
  const cancelBtn = modal.querySelector('#cancel-btn');
  const loading = modal.querySelector('#loading');
  
  let activeTab = 'upload';
  
  // Tab switching
  uploadTab.addEventListener('click', () => {
    activeTab = 'upload';
    uploadTab.className = 'px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600';
    urlTab.className = 'px-4 py-2 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    uploadContent.classList.remove('hidden');
    urlContent.classList.add('hidden');
  });
  
  urlTab.addEventListener('click', () => {
    activeTab = 'url';
    urlTab.className = 'px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600';
    uploadTab.className = 'px-4 py-2 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    urlContent.classList.remove('hidden');
    uploadContent.classList.add('hidden');
  });
  
  // Handle image insertion
  const handleInsert = async () => {
    try {
      let imageUrl = '';
      const altText = altInput.value.trim();
      
      if (activeTab === 'upload') {
        const file = fileInput.files[0];
        if (!file) {
          showSnackbar?.('Please select an image file', 'error');
          return;
        }
        
        // Show loading
        loading.classList.remove('hidden');
        insertBtn.disabled = true;
        
        imageUrl = await uploadImage(file);
      } else {
        imageUrl = urlInput.value.trim();
        if (!imageUrl) {
          showSnackbar?.('Please enter an image URL', 'error');
          return;
        }
      }
      
      // Insert image into editor
      editor.chain().focus().setImage({ 
        src: imageUrl, 
        alt: altText || 'Image',
        title: altText || 'Image'
      }).run();
      
      showSnackbar?.('Image inserted successfully', 'success');
      document.body.removeChild(modal);
      
    } catch (error) {
      console.error('Error inserting image:', error);
      showSnackbar?.(error.message || 'Failed to insert image', 'error');
      loading.classList.add('hidden');
      insertBtn.disabled = false;
    }
  };
  
  // Event listeners
  insertBtn.addEventListener('click', handleInsert);
  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Focus first input
  fileInput.focus();
};

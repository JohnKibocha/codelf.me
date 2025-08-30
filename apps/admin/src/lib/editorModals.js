/**
 * Handle link insertion with better UI
 * @param {Function} editor - TipTap editor instance
 */
export const handleLinkInsertion = async (editor) => {
  // Get selected text if any
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to);
  
  // Create modal for link input
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Link</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
          <input type="url" id="link-url" placeholder="https://example.com" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text</label>
          <input type="text" id="link-text" placeholder="Link text" value="${selectedText}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
        </div>
        
        <div class="flex items-center">
          <input type="checkbox" id="link-new-tab" class="mr-2 accent-blue-600"/>
          <label for="link-new-tab" class="text-sm text-gray-700 dark:text-gray-300">Open in new tab</label>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-6">
        <button id="cancel-link-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
        <button id="insert-link-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Insert Link</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const urlInput = modal.querySelector('#link-url');
  const textInput = modal.querySelector('#link-text');
  const newTabCheckbox = modal.querySelector('#link-new-tab');
  const insertBtn = modal.querySelector('#insert-link-btn');
  const cancelBtn = modal.querySelector('#cancel-link-btn');
  
  // Handle link insertion
  const handleInsert = () => {
    const url = urlInput.value.trim();
    const text = textInput.value.trim();
    const newTab = newTabCheckbox.checked;
    
    if (!url) {
      urlInput.focus();
      return;
    }
    
    if (!text) {
      textInput.focus();
      return;
    }
    
    // Insert or update link
    if (selectedText) {
      // Update existing selection
      editor.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ 
          href: url,
          target: newTab ? '_blank' : null
        })
        .run();
    } else {
      // Insert new link
      editor.chain()
        .focus()
        .insertContent(`<a href="${url}"${newTab ? ' target="_blank"' : ''}>${text}</a>`)
        .run();
    }
    
    document.body.removeChild(modal);
  };
  
  // Event listeners
  insertBtn.addEventListener('click', handleInsert);
  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
  
  // Enter key to insert
  [urlInput, textInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleInsert();
      }
    });
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Focus URL input
  urlInput.focus();
};

/**
 * Handle math equation insertion with better UI
 * @param {Function} editor - TipTap editor instance
 * @param {string} type - 'inline' or 'block'
 */
export const handleMathInsertion = async (editor, type = 'inline') => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  const isBlock = type === 'block';
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Insert ${isBlock ? 'Block' : 'Inline'} Math
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LaTeX Expression ${isBlock ? '(without $$)' : '(without $)'}
          </label>
          <textarea 
            id="math-input" 
            placeholder="${isBlock ? 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' : 'x^2 + y^2 = r^2'}"
            rows="${isBlock ? '4' : '2'}"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
          ></textarea>
        </div>
        
        <div class="text-xs text-gray-500 space-y-1">
          <p><strong>Examples:</strong></p>
          <p>• Fractions: \\frac{numerator}{denominator}</p>
          <p>• Superscript: x^{2} or x^2</p>
          <p>• Subscript: x_{1} or x_1</p>
          <p>• Greek letters: \\alpha, \\beta, \\gamma</p>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-6">
        <button id="cancel-math-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
        <button id="insert-math-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Insert Math</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const mathInput = modal.querySelector('#math-input');
  const insertBtn = modal.querySelector('#insert-math-btn');
  const cancelBtn = modal.querySelector('#cancel-math-btn');
  
  // Handle math insertion
  const handleInsert = () => {
    const mathContent = mathInput.value.trim();
    
    if (!mathContent) {
      mathInput.focus();
      return;
    }
    
    if (isBlock) {
      editor.chain().focus().setBlockMath(mathContent).run();
    } else {
      editor.chain().focus().setInlineMath(mathContent).run();
    }
    
    document.body.removeChild(modal);
  };
  
  // Event listeners
  insertBtn.addEventListener('click', handleInsert);
  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
  
  // Ctrl+Enter to insert
  mathInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInsert();
    }
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Focus input
  mathInput.focus();
};

import { Node, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import mermaid from 'mermaid';
import katex from 'katex';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});

// Mermaid Diagram Extension
export const MermaidDiagram = Node.create({
  name: 'mermaidDiagram',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code: {
        default: '',
      },
      type: {
        default: 'flowchart',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-mermaid]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-mermaid': node.attrs.code,
        'data-type': node.attrs.type,
        class: 'mermaid-diagram',
      },
      ['pre', { class: 'mermaid-code' }, node.attrs.code],
      ['div', { class: 'mermaid-output' }],
    ];
  },

  addCommands() {
    return {
      insertMermaidDiagram: (type = 'flowchart', code = '') => ({ commands }) => {
        const defaultCode = this.getDefaultCode(type);
        return commands.insertContent({
          type: this.name,
          attrs: {
            code: code || defaultCode,
            type,
          },
        });
      },
    };
  },

  getDefaultCode(type) {
    const templates = {
      flowchart: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`,
      sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hello Alice!`,
      gantt: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research    :a1, 2024-01-01, 30d
    Design      :after a1, 20d`,
      pie: `pie title Favorite Colors
    "Red" : 42
    "Blue" : 35
    "Green" : 23`,
      mindmap: `mindmap
  root((Project))
    Planning
      Research
      Analysis
    Development
      Frontend
      Backend
    Testing
      Unit Tests
      Integration`,
    };
    return templates[type] || templates.flowchart;
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'mermaid-container';
      
      const toolbar = document.createElement('div');
      toolbar.className = 'mermaid-toolbar';
      
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'mermaid-btn';
      editBtn.onclick = () => this.openDiagramEditor(node, getPos, editor);
      
      const typeLabel = document.createElement('span');
      typeLabel.textContent = node.attrs.type.toUpperCase();
      typeLabel.className = 'mermaid-type';
      
      toolbar.appendChild(typeLabel);
      toolbar.appendChild(editBtn);
      
      const diagramDiv = document.createElement('div');
      diagramDiv.className = 'mermaid-output';
      
      // Render mermaid diagram
      this.renderMermaid(node.attrs.code, diagramDiv);
      
      container.appendChild(toolbar);
      container.appendChild(diagramDiv);
      
      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;
          if (updatedNode.attrs.code !== node.attrs.code) {
            this.renderMermaid(updatedNode.attrs.code, diagramDiv);
          }
          return true;
        },
      };
    };
  },

  async renderMermaid(code, element) {
    try {
      const { svg } = await mermaid.render(`mermaid-${Date.now()}`, code);
      element.innerHTML = svg;
    } catch (error) {
      element.innerHTML = `<div class="mermaid-error">Error rendering diagram: ${error.message}</div>`;
    }
  },

  openDiagramEditor(node, getPos, editor) {
    // Create and show diagram editor modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit Diagram</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagram Code:</label>
          <textarea 
            id="diagram-code" 
            class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm"
            style="font-family: 'JetBrains Mono', monospace;"
          >${node.attrs.code}</textarea>
        </div>
        
        <div class="flex justify-end gap-3">
          <button id="cancel-diagram-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
          <button id="save-diagram-btn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#save-diagram-btn').addEventListener('click', () => {
      const newCode = modal.querySelector('#diagram-code').value;
      editor.chain().focus().updateAttributes('mermaidDiagram', { code: newCode }).run();
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-diagram-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  },
});

// Enhanced Math Extension with KaTeX
export const KaTeXMath = Extension.create({
  name: 'katexMath',

  addCommands() {
    return {
      insertInlineMath: (latex = '') => ({ commands }) => {
        const placeholder = latex || 'E = mc^2';
        return commands.insertContent(`<span class="math-inline" data-latex="${placeholder}"></span>`);
      },
      insertBlockMath: (latex = '') => ({ commands }) => {
        const placeholder = latex || '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}';
        return commands.insertContent(`<div class="math-block" data-latex="${placeholder}"></div>`);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => this.editor.commands.insertInlineMath(),
      'Mod-Shift-M': () => this.editor.commands.insertBlockMath(),
    };
  },

  onUpdate() {
    // Render all math elements
    this.renderMathElements();
  },

  renderMathElements() {
    const mathElements = document.querySelectorAll('.math-inline[data-latex], .math-block[data-latex]');
    mathElements.forEach(el => {
      const latex = el.getAttribute('data-latex');
      const isBlock = el.classList.contains('math-block');
      
      try {
        katex.render(latex, el, {
          displayMode: isBlock,
          throwOnError: false,
          strict: false,
        });
      } catch (error) {
        el.innerHTML = `<span class="math-error">Error: ${error.message}</span>`;
      }
    });
  },
});

// Advanced Table Extension
export const AdvancedTable = Extension.create({
  name: 'advancedTable',

  addCommands() {
    return {
      insertAdvancedTable: (rows = 3, cols = 3) => ({ commands }) => {
        let tableHTML = '<table class="advanced-table"><thead><tr>';
        
        // Header row
        for (let i = 0; i < cols; i++) {
          tableHTML += `<th>Header ${i + 1}</th>`;
        }
        tableHTML += '</tr></thead><tbody>';
        
        // Body rows
        for (let i = 0; i < rows - 1; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < cols; j++) {
            tableHTML += `<td>Cell ${i + 1}-${j + 1}</td>`;
          }
          tableHTML += '</tr>';
        }
        
        tableHTML += '</tbody></table>';
        return commands.insertContent(tableHTML);
      },
      addTableCaption: () => ({ commands }) => {
        // Implementation for table captions
        return true;
      },
      toggleTableAlignment: (alignment) => ({ commands }) => {
        // Implementation for table alignment
        return true;
      },
    };
  },
});

// Code Language Picker Extension
export const CodeLanguagePicker = Extension.create({
  name: 'codeLanguagePicker',

  addCommands() {
    return {
      openLanguagePicker: () => ({ editor }) => {
        this.showLanguagePicker(editor);
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.openLanguagePicker(),
    };
  },

  showLanguagePicker(editor) {
    const languages = [
      { name: 'JavaScript', value: 'javascript', color: '#F7DF1E' },
      { name: 'TypeScript', value: 'typescript', color: '#3178C6' },
      { name: 'Python', value: 'python', color: '#3776AB' },
      { name: 'Java', value: 'java', color: '#ED8B00' },
      { name: 'C++', value: 'cpp', color: '#00599C' },
      { name: 'CSS', value: 'css', color: '#1572B6' },
      { name: 'HTML', value: 'html', color: '#E34F26' },
      { name: 'JSON', value: 'json', color: '#000000' },
      { name: 'Bash', value: 'bash', color: '#4EAA25' },
      { name: 'SQL', value: 'sql', color: '#336791' },
      { name: 'PHP', value: 'php', color: '#777BB4' },
      { name: 'Go', value: 'go', color: '#00ADD8' },
      { name: 'Rust', value: 'rust', color: '#CE422B' },
      { name: 'YAML', value: 'yaml', color: '#CB171E' },
      { name: 'Markdown', value: 'markdown', color: '#083FA1' },
      { name: 'Plain Text', value: 'text', color: '#6B7280' },
    ];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select Code Language</h3>
        
        <div class="space-y-2">
          ${languages.map(lang => `
            <button 
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 language-option"
              data-language="${lang.value}"
            >
              <div class="w-4 h-4 rounded" style="background-color: ${lang.color}"></div>
              <span class="text-gray-900 dark:text-white">${lang.name}</span>
              <span class="text-xs text-gray-500 ml-auto">${lang.value}</span>
            </button>
          `).join('')}
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button id="cancel-lang-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelectorAll('.language-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const language = btn.getAttribute('data-language');
        editor.chain().focus().setCodeBlock({ language }).run();
        document.body.removeChild(modal);
      });
    });
    
    modal.querySelector('#cancel-lang-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  },
});

// Word Count and Character Count Extension
export const WordCounter = Extension.create({
  name: 'wordCounter',

  addStorage() {
    return {
      wordCount: 0,
      characterCount: 0,
      characterCountNoSpaces: 0,
      readingTime: 0,
    };
  },

  onUpdate() {
    const { editor } = this;
    const text = editor.getText();
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const readingTime = Math.ceil(words.length / 200); // Assuming 200 WPM
    
    this.storage.wordCount = words.length;
    this.storage.characterCount = characters;
    this.storage.characterCountNoSpaces = charactersNoSpaces;
    this.storage.readingTime = readingTime;
    
    // Update word count display
    this.updateWordCountDisplay();
  },

  updateWordCountDisplay() {
    const displays = document.querySelectorAll('.word-count-display');
    displays.forEach(display => {
      display.innerHTML = `
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>Words: <span class="font-medium">${this.storage.wordCount}</span></div>
          <div>Characters: <span class="font-medium">${this.storage.characterCount}</span></div>
          <div>Reading time: <span class="font-medium">${this.storage.readingTime} min</span></div>
        </div>
      `;
    });
  },
});

// Auto-save Extension
export const AutoSave = Extension.create({
  name: 'autoSave',

  addOptions() {
    return {
      delay: 5000, // 5 seconds
      onSave: () => {},
    };
  },

  addStorage() {
    return {
      timeout: null,
      lastSaved: null,
    };
  },

  onUpdate() {
    if (this.storage.timeout) {
      clearTimeout(this.storage.timeout);
    }
    
    this.storage.timeout = setTimeout(() => {
      this.options.onSave(this.editor.getHTML());
      this.storage.lastSaved = new Date();
      this.updateSaveStatus();
    }, this.options.delay);
  },

  updateSaveStatus() {
    const statusElements = document.querySelectorAll('.save-status');
    statusElements.forEach(element => {
      element.textContent = `Last saved: ${this.storage.lastSaved?.toLocaleTimeString() || 'Never'}`;
      element.className = 'save-status text-green-600 dark:text-green-400';
    });
  },
});

// Focus Mode Extension
export const FocusMode = Extension.create({
  name: 'focusMode',

  addStorage() {
    return {
      enabled: false,
    };
  },

  addCommands() {
    return {
      toggleFocusMode: () => ({ editor }) => {
        this.storage.enabled = !this.storage.enabled;
        this.updateFocusMode(editor);
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-f': () => this.editor.commands.toggleFocusMode(),
    };
  },

  updateFocusMode(editor) {
    const editorElement = editor.view.dom.closest('.medium-editor-container');
    
    if (this.storage.enabled) {
      editorElement?.classList.add('focus-mode');
      document.body.classList.add('editor-focus-mode');
    } else {
      editorElement?.classList.remove('focus-mode');
      document.body.classList.remove('editor-focus-mode');
    }
    
    // Update focus mode button state
    const focusButtons = document.querySelectorAll('.focus-mode-btn');
    focusButtons.forEach(btn => {
      btn.classList.toggle('active', this.storage.enabled);
    });
  },
});

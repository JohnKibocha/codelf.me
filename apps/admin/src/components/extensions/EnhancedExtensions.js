import { Extension, Node, Mark } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

// Enhanced Math Extension with better LaTeX support
export const Math = Extension.create({
  name: 'math',

  addCommands() {
    return {
      setInlineMath: (content) => ({ commands }) => {
        return commands.insertContent(`<span class="math-inline" data-math="${content}">$${content}$</span>`);
      },
      setBlockMath: (content) => ({ commands }) => {
        return commands.insertContent(`<div class="math-block" data-math="${content}">$$${content}$$</div>`);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => this.editor.commands.setInlineMath(''),
      'Mod-Shift-M': () => this.editor.commands.setBlockMath(''),
    };
  },
});

// Enhanced Admonition Extension with more types
export const Admonition = Extension.create({
  name: 'admonition',

  addCommands() {
    return {
      setAdmonition: (type, title = '', content = '') => ({ commands }) => {
        const admonitionContent = `
          <div class="admonition admonition-${type}">
            <div class="admonition-title">${this.getIcon(type)} ${title || type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="admonition-content">${content || 'Enter your content here...'}</div>
          </div>
        `;
        return commands.insertContent(admonitionContent);
      },
    };
  },

  getIcon(type) {
    const icons = {
      note: '📝',
      warning: '⚠️',
      tip: '💡',
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      question: '❓',
      example: '📋',
      quote: '💬'
    };
    return icons[type] || '📝';
  },
});

// Enhanced Footnote Extension
export const Footnote = Extension.create({
  name: 'footnote',

  addGlobalAttributes() {
    return [
      {
        types: ['footnote'],
        attributes: {
          id: {
            default: null,
          },
          content: {
            default: null,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFootnote: (content) => ({ commands }) => {
        const id = `fn-${Date.now()}`;
        const footnoteRef = `<sup class="footnote-ref"><a href="#${id}">[${this.getFootnoteNumber()}]</a></sup>`;
        const footnoteContent = `<div class="footnote-item" id="${id}" data-number="${this.getFootnoteNumber()}">${content}</div>`;
        
        // Insert reference at cursor
        commands.insertContent(footnoteRef);
        
        // Add to footnotes section (handled by the editor)
        this.addFootnoteToSection(footnoteContent);
        
        return true;
      },
    };
  },

  getFootnoteNumber() {
    const footnotes = document.querySelectorAll('.footnote-ref');
    return footnotes.length + 1;
  },

  addFootnoteToSection(content) {
    // This would be handled by the editor's footnote management
    console.log('Add footnote:', content);
  },
});

// Enhanced Emoji Extension with shortcuts
export const Emoji = Extension.create({
  name: 'emoji',

  addCommands() {
    return {
      insertEmoji: (emoji) => ({ commands }) => {
        return commands.insertContent(emoji);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ':smile:': () => this.editor.commands.insertEmoji('😊'),
      ':heart:': () => this.editor.commands.insertEmoji('❤️'),
      ':thumbs:': () => this.editor.commands.insertEmoji('👍'),
      ':fire:': () => this.editor.commands.insertEmoji('🔥'),
      ':rocket:': () => this.editor.commands.insertEmoji('🚀'),
      ':star:': () => this.editor.commands.insertEmoji('⭐'),
      ':check:': () => this.editor.commands.insertEmoji('✅'),
      ':x:': () => this.editor.commands.insertEmoji('❌'),
      ':warning:': () => this.editor.commands.insertEmoji('⚠️'),
      ':info:': () => this.editor.commands.insertEmoji('ℹ️'),
    };
  },
});

// Advanced Highlight Extension with multiple colors
export const AdvancedHighlight = Mark.create({
  name: 'advancedHighlight',

  addOptions() {
    return {
      multicolor: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) {
            return {};
          }
          return {
            'data-color': attributes.color,
            class: `highlight highlight-${attributes.color}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-color]',
      },
      {
        tag: 'span.highlight',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setHighlight: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleHighlight: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetHighlight: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight({ color: 'yellow' }),
      'Mod-Shift-y': () => this.editor.commands.toggleHighlight({ color: 'yellow' }),
      'Mod-Shift-g': () => this.editor.commands.toggleHighlight({ color: 'green' }),
      'Mod-Shift-b': () => this.editor.commands.toggleHighlight({ color: 'blue' }),
      'Mod-Shift-p': () => this.editor.commands.toggleHighlight({ color: 'pink' }),
    };
  },
});

// Definition List Extensions
export const DefinitionTerm = Node.create({
  name: 'definitionTerm',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'dt' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['dt', { class: 'definition-term', ...HTMLAttributes }, 0];
  },
});

export const DefinitionDescription = Node.create({
  name: 'definitionDescription',
  group: 'block',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'dd' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['dd', { class: 'definition-description', ...HTMLAttributes }, 0];
  },
});

export const DefinitionItem = Node.create({
  name: 'definitionItem',
  group: 'block',
  content: 'definitionTerm definitionDescription+',

  parseHTML() {
    return [{ tag: 'div', getAttrs: node => node.classList.contains('definition-item') ? {} : false }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'definition-item', ...HTMLAttributes }, 0];
  },
});

export const DefinitionList = Node.create({
  name: 'definitionList',
  group: 'block',
  content: 'definitionItem+',

  parseHTML() {
    return [{ tag: 'dl' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['dl', { class: 'definition-list', ...HTMLAttributes }, 0];
  },

  addCommands() {
    return {
      insertDefinitionList: () => ({ commands }) => {
        return commands.insertContent(`
          <dl class="definition-list">
            <div class="definition-item">
              <dt class="definition-term">Term</dt>
              <dd class="definition-description"><p>Definition</p></dd>
            </div>
          </dl>
        `);
      },
    };
  },
});

// Collapsible Section Extension
export const CollapsibleSection = Node.create({
  name: 'collapsibleSection',
  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: 'Click to expand',
      },
      open: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'details' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'details',
      { ...HTMLAttributes, class: 'collapsible-section', open: node.attrs.open },
      ['summary', { class: 'collapsible-title' }, node.attrs.title],
      ['div', { class: 'collapsible-content' }, 0],
    ];
  },

  addCommands() {
    return {
      insertCollapsibleSection: (title = 'Click to expand') => ({ commands }) => {
        return commands.insertContent(`
          <details class="collapsible-section">
            <summary class="collapsible-title">${title}</summary>
            <div class="collapsible-content">
              <p>Content goes here...</p>
            </div>
          </details>
        `);
      },
    };
  },
});

// Horizontal Rule with styles
export const StyledHorizontalRule = Node.create({
  name: 'styledHorizontalRule',
  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      style: {
        default: 'solid',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'hr' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['hr', { ...HTMLAttributes, class: `hr-${node.attrs.style}` }];
  },

  addCommands() {
    return {
      setHorizontalRule: (style = 'solid') => ({ commands }) => {
        return commands.insertContent(`<hr class="hr-${style}" />`);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift--': () => this.editor.commands.setHorizontalRule(),
    };
  },
});

// Code with language picker
export const AdvancedCodeBlock = Extension.create({
  name: 'advancedCodeBlock',

  addCommands() {
    return {
      setCodeBlock: (language = 'text') => ({ commands }) => {
        return commands.setCodeBlock({ language });
      },
      insertCodeBlock: (language = 'text', content = '') => ({ commands }) => {
        return commands.insertContent(`
          <pre><code class="language-${language}">${content}</code></pre>
        `);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.openLanguagePicker(),
    };
  },

  openLanguagePicker() {
    // This would open a language picker modal
    const languages = [
      'javascript', 'typescript', 'python', 'java', 'cpp', 'css', 'html',
      'json', 'bash', 'sql', 'php', 'go', 'rust', 'yaml', 'markdown'
    ];
    
    // Implementation would go here
    console.log('Language picker for:', languages);
  },
});

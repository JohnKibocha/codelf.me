import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

// Custom Math Extension for inline and block math
export const Math = Extension.create({
  name: 'math',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          mathMode: {
            default: null,
            parseHTML: element => element.getAttribute('data-math-mode'),
            renderHTML: attributes => {
              if (!attributes.mathMode) {
                return {};
              }
              return {
                'data-math-mode': attributes.mathMode,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setInlineMath: (content) => ({ commands }) => {
        return commands.insertContent(`$${content}$`);
      },
      setBlockMath: (content) => ({ commands }) => {
        return commands.insertContent(`$$\n${content}\n$$`);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => this.editor.commands.setInlineMath(''),
      'Mod-Shift-M': () => this.editor.commands.setBlockMath(''),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('math'),
        view(editorView) {
          return {
            update: (view, prevState) => {
              // Simple math rendering - in a real implementation, you'd use KaTeX here
              const mathBlocks = view.dom.querySelectorAll('[data-math-mode]');
              mathBlocks.forEach(block => {
                if (!block.dataset.processed) {
                  block.style.fontFamily = 'KaTeX_Math, Times New Roman, serif';
                  block.style.fontStyle = 'italic';
                  block.dataset.processed = 'true';
                }
              });
            },
          };
        },
      }),
    ];
  },
});

// Custom Admonition Extension for callouts like GitHub/GitLab
export const Admonition = Extension.create({
  name: 'admonition',

  addGlobalAttributes() {
    return [
      {
        types: ['blockquote'],
        attributes: {
          admonitionType: {
            default: null,
            parseHTML: element => element.getAttribute('data-admonition-type'),
            renderHTML: attributes => {
              if (!attributes.admonitionType) {
                return {};
              }
              return {
                'data-admonition-type': attributes.admonitionType,
                class: `admonition admonition-${attributes.admonitionType}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setAdmonition: (type = 'note') => ({ commands }) => {
        return commands.wrapIn('blockquote', { admonitionType: type });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-n': () => this.editor.commands.setAdmonition('note'),
      'Mod-Shift-w': () => this.editor.commands.setAdmonition('warning'),
      'Mod-Shift-i': () => this.editor.commands.setAdmonition('info'),
      'Mod-Shift-t': () => this.editor.commands.setAdmonition('tip'),
    };
  },
});

// Custom Footnote Extension
export const Footnote = Extension.create({
  name: 'footnote',

  addCommands() {
    return {
      insertFootnote: (content, id) => ({ commands }) => {
        const footnoteId = id || `fn-${Date.now()}`;
        return commands.insertContent(
          `<sup><a href="#${footnoteId}" id="${footnoteId}-ref">${content}</a></sup>`
        );
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-f': () => {
        const content = window.prompt('Footnote number:');
        if (content) {
          return this.editor.commands.insertFootnote(content);
        }
        return false;
      },
    };
  },
});

// Custom Emoji Extension
export const Emoji = Extension.create({
  name: 'emoji',

  addCommands() {
    return {
      insertEmoji: (emoji) => ({ commands }) => {
        return commands.insertContent(emoji);
      },
    };
  },

  addInputRules() {
    return [
      // Common emoji shortcuts
      {
        find: /:smile:/g,
        replace: '😊',
      },
      {
        find: /:heart:/g,
        replace: '❤️',
      },
      {
        find: /:thumbsup:/g,
        replace: '👍',
      },
      {
        find: /:fire:/g,
        replace: '🔥',
      },
      {
        find: /:rocket:/g,
        replace: '🚀',
      },
      {
        find: /:eyes:/g,
        replace: '👀',
      },
      {
        find: /:tada:/g,
        replace: '🎉',
      },
      {
        find: /:thinking:/g,
        replace: '🤔',
      },
    ];
  },
});

// Custom Highlight Styles Extension
export const AdvancedHighlight = Extension.create({
  name: 'advancedHighlight',

  addCommands() {
    return {
      setHighlightColor: (color) => ({ commands }) => {
        return commands.setMark('highlight', { color });
      },
      setYellowHighlight: () => ({ commands }) => {
        return commands.setMark('highlight', { color: '#fef08a' });
      },
      setGreenHighlight: () => ({ commands }) => {
        return commands.setMark('highlight', { color: '#bbf7d0' });
      },
      setPinkHighlight: () => ({ commands }) => {
        return commands.setMark('highlight', { color: '#fce7f3' });
      },
      setBlueHighlight: () => ({ commands }) => {
        return commands.setMark('highlight', { color: '#dbeafe' });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-y': () => this.editor.commands.setYellowHighlight(),
      'Mod-Shift-g': () => this.editor.commands.setGreenHighlight(),
      'Mod-Shift-p': () => this.editor.commands.setPinkHighlight(),
      'Mod-Shift-b': () => this.editor.commands.setBlueHighlight(),
    };
  },
});

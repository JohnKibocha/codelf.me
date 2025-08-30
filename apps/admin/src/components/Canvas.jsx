import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Focus from '@tiptap/extension-focus';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { Extension } from '@tiptap/core';
import MarkdownIt from 'markdown-it';
import { lowlight } from 'lowlight';
import { Math, Admonition, Footnote, Emoji, AdvancedHighlight } from './extensions/AdvancedExtensions.js';
import { 
  CollapsibleSection, 
  StyledHorizontalRule, 
  AdvancedCodeBlock 
} from './extensions/EnhancedExtensions.js';
// Temporarily disabled advanced features
// import { 
//   MermaidDiagram, 
//   KaTeXMath, 
//   AdvancedTable, 
//   CodeLanguagePicker, 
//   WordCounter, 
//   AutoSave, 
//   FocusMode 
// } from './extensions/AdvancedFeatures.js';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import './canvas.css';
import '../styles/medium-like.css';
import '../styles/syntax-highlighting.css';
import './extensions/advanced-features.css';
import ArticlePreview from './ArticlePreview';

// Import languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import php from 'highlight.js/lib/languages/php';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import yaml from 'highlight.js/lib/languages/yaml';

// Register languages
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('java', java);
lowlight.registerLanguage('cpp', cpp);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('json', json);
lowlight.registerLanguage('bash', bash);
lowlight.registerLanguage('sql', sql);
lowlight.registerLanguage('php', php);
lowlight.registerLanguage('go', go);
lowlight.registerLanguage('rust', rust);
lowlight.registerLanguage('yaml', yaml);

const md = new MarkdownIt();

const TableNavigation = Extension.create({
  name: 'tableNavigation',
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.focusNextCell?.() || false,
      'Shift-Tab': () => this.editor.commands.focusPreviousCell?.() || false,
      'Mod-Enter': () => this.editor.commands.addRowAfter?.() || false,
      'Mod-Backspace': () => this.editor.commands.deleteRow?.() || false,
    };
  },
});

const Canvas = ({ value, onChange, preview, theme, onRequestEdit, editor, setEditor, meta, title, date, category, tags, blogId }) => {
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] }, codeBlock: false }),
      CodeBlockLowlight.configure({ 
        lowlight, 
        defaultLanguage: 'js',
        HTMLAttributes: {
          class: 'medium-code-block',
        },
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        transformPastedText: true,
        transformCopiedText: true,
        inputRules: true,
        shortcuts: true,
      }),
      Underline,
      AdvancedHighlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'medium-task-list',
        },
      }),
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {
          class: 'medium-task-item',
        },
      }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'medium-link',
        },
      }),
      Image.configure({ 
        allowBase64: true,
        HTMLAttributes: {
          class: 'medium-image',
        },
      }),
      Table.configure({ 
        resizable: true,
        HTMLAttributes: {
          class: 'medium-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TableNavigation,
      // New advanced extensions
      Superscript,
      Subscript,
      Color,
      TextStyle,
      Dropcursor.configure({
        color: 'var(--medium-accent)',
        width: 2,
      }),
      Gapcursor,
      Focus.configure({
        className: 'medium-focus',
        mode: 'all',
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Write a compelling headline...';
          }
          return 'Start writing your story...';
        },
        emptyEditorClass: 'medium-placeholder',
      }),
      // Custom extensions
      Math,
      Admonition,
      Footnote,
      Emoji,
      AdvancedHighlight,
      // DefinitionList, // Temporarily disabled due to schema issues
      // DefinitionItem,
      // DefinitionTerm,
      // DefinitionDescription,
      CollapsibleSection,
      StyledHorizontalRule,
      AdvancedCodeBlock,
      // Phase 3 Advanced Features - temporarily disabled
      // MermaidDiagram,
      // KaTeXMath,
      // AdvancedTable,
      // CodeLanguagePicker,
      // WordCounter,
      // AutoSave.configure({
      //   delay: 5000,
      //   onSave: (content) => {
      //     if (onChange) onChange(content);
      //     console.log('Auto-saved content');
      //   },
      // }),
      // FocusMode,
      CharacterCount,
      Typography.configure({
        openDoubleQuote: '"',
        closeDoubleQuote: '"',
        openSingleQuote: "'",
        closeSingleQuote: "'",
        ellipsis: '…',
        emDash: '—',
        enDash: '–',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  });

  // Focus editor and set cursor at click position
  const handleCanvasClick = (e) => {
    if (!tiptapEditor) return;
    // Focus the editor
    tiptapEditor.commands.focus();
    // Try to set the cursor at the clicked position
    // (Tiptap does not natively support click-to-position on the wrapper, so we focus at start)
    // Optionally, you can use a ref and selection logic for more accuracy
  };

  React.useEffect(() => {
    if (tiptapEditor && setEditor) setEditor(tiptapEditor);
    // Always keep the editor focused for blinking cursor
    if (tiptapEditor) tiptapEditor.commands.focus();
  }, [tiptapEditor]);

  React.useEffect(() => {
    if (tiptapEditor && value !== tiptapEditor.getHTML()) {
      tiptapEditor.commands.setContent(value || '', false);
    }
  }, [value]);

  const handlePaste = (event) => {
    const text = event.clipboardData?.getData('text/plain');
    const isMarkdown = text && /^[#>\-\*\d]/m.test(text);
    if (isMarkdown) {
      event.preventDefault();
      const html = md.render(text);
      tiptapEditor.commands.insertContent(html);
    }
  };

  if (preview) {
    // Auto-detect theme if not provided
    const isDark = theme === 'dark' || 
                   (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
                   (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');
    
    return (
      <div className="medium-editor-container relative w-full min-h-screen flex flex-col items-center justify-center transition-all duration-300">
        <ArticlePreview
          html={value}
          onEdit={() => onRequestEdit ? onRequestEdit() : setEditor && setEditor(true)}
          meta={meta}
          title={title}
          date={date}
          category={category}
          tags={tags}
          username={meta?.author}
          avatar={meta?.authorImage}
          onBack={() => onRequestEdit ? onRequestEdit() : setEditor && setEditor(true)}
          darkTheme={isDark}
        />
      </div>
    );
  }

  // Medium-like editor container
  return (
    <div className="flex justify-center w-full min-h-[900px] py-8">
      <div
        className="medium-article relative shadow-2xl rounded-lg border w-[794px] min-h-[1123px] max-w-full p-14 overflow-auto flex flex-col cursor-text"
        style={{ backgroundColor: 'var(--medium-background)', color: 'var(--medium-text)', borderColor: 'var(--medium-border)' }}
        onClick={handleCanvasClick}
        tabIndex={0}
      >
        {/* Improved meta fields above the editor */}
        <div className="mb-8">
          {meta?.coverImage && (
            <div className="w-full aspect-[2.5/1] mb-6 overflow-hidden rounded-lg">
              <img src={meta.coverImage} alt={title || meta?.title || 'Cover'} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="block w-full text-4xl font-bold bg-transparent outline-none mb-4">{title || meta?.title || 'Untitled Article'}</h1>
          {meta?.subtitle && <h2 className="text-xl text-gray-600 dark:text-gray-300 font-normal mb-4">{meta.subtitle}</h2>}
          <div className="flex items-center gap-3 mt-4 mb-6">
            {meta?.authorImage && <img src={meta.authorImage} alt={meta.author || 'Author'} className="w-12 h-12 rounded-full object-cover" />}
            <div>
              <div className="text-base font-medium">{meta?.author || 'Anonymous'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{date || meta?.date || meta?.publishedAt || meta?.$createdAt ? new Date(date || meta?.date || meta?.publishedAt || meta?.$createdAt).toLocaleDateString() : ''}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {(category || meta?.category) && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-300">Category:</span>
                <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">{category || meta?.category}</span>
              </div>
            )}
            {(tags && tags.length > 0) || (meta?.tags && meta?.tags.length > 0) ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-300">Tags:</span>
                {(tags && tags.length > 0 ? tags : meta?.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <EditorContent
          editor={tiptapEditor}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && tiptapEditor?.isActive('codeBlock')) {
              e.preventDefault();
              tiptapEditor.commands.insertContent('    '); // four spaces
            }
          }}
          onPaste={handlePaste}
          className="tiptap min-h-[900px] focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Canvas;

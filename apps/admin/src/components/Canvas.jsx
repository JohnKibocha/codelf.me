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
import { Markdown } from 'tiptap-markdown';
import { Extension } from '@tiptap/core';
import MarkdownIt from 'markdown-it';
import { lowlight } from 'lowlight';
import './canvas.css';
import ArticlePreview from './ArticlePreview';
import 'highlight.js/styles/atom-one-dark.css';

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
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'js' }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        transformPastedText: true,
        transformCopiedText: true,
        // Enable input rules for live markdown shortcuts
        inputRules: true,
        shortcuts: true,
      }),
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TableNavigation,
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
    return (
      <div style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)' }} className="relative w-full min-h-screen flex flex-col items-center justify-center transition-all duration-300">
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
        />
      </div>
    );
  }

  // Improved metadata rendering
  return (
    <div className="flex justify-center w-full min-h-[900px] py-8">
      <div
        className="relative shadow-2xl rounded-lg border w-[794px] min-h-[1123px] max-w-full p-14 overflow-auto flex flex-col cursor-text"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)', borderColor: 'var(--input-bg)' }}
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
          <h1 className="block w-full text-3xl font-bold bg-transparent outline-none mb-2" style={{ fontFamily: 'Charter, Georgia, serif' }}>{title || meta?.title || 'Untitled Article'}</h1>
          {meta?.subtitle && <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">{meta.subtitle}</h2>}
          <div className="flex items-center gap-3 mt-2 mb-2">
            {meta?.authorImage && <img src={meta.authorImage} alt={meta.author || 'Author'} className="w-10 h-10 rounded-full object-cover" />}
            <div>
              <div className="text-base font-medium text-gray-800 dark:text-gray-200">{meta?.author || 'Anonymous'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{date || meta?.date || meta?.publishedAt || meta?.$createdAt ? new Date(date || meta?.date || meta?.publishedAt || meta?.$createdAt).toLocaleDateString() : ''}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {(category || meta?.category) && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-gray-600 dark:text-gray-300">Category:</span>
                <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{category || meta?.category}</span>
              </div>
            )}
            {(tags && tags.length > 0) || (meta?.tags && meta?.tags.length > 0) ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-xs text-gray-600 dark:text-gray-300">Tags:</span>
                {(tags && tags.length > 0 ? tags : meta?.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="bg-gray-200 dark:bg-blue-700 text-gray-700 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
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

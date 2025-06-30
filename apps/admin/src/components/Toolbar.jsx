import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Undo,
  Redo,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
  Pilcrow,
  Minus,
  Table,
  FileText,
  CheckSquare,
  Highlighter,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Upload
} from 'lucide-react';
import './toolbar-btn.css';

const Toolbar = ({ onPreview, theme, editor, preview, setPreview, ...props }) => {
  // Helper to check if a mark is active
  const isActive = (type, opts) => editor && typeof editor.isActive === 'function' && editor.isActive(type, opts);

  if (!editor || typeof editor.isActive !== 'function') {
    return (
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-100 dark:bg-gray-800 transition-colors duration-200 rounded-t shadow-sm overflow-x-auto min-h-[48px] opacity-60 pointer-events-none">
        Loading editor...
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-100 dark:bg-gray-800 transition-colors duration-200 rounded-t shadow-sm overflow-x-auto"
      style={{ minHeight: 48 }}
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`toolbar-btn ${isActive('heading', { level: 1 }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Heading 1"
        title="Heading 1"
        tabIndex={0}
      >
        <Heading1 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`toolbar-btn ${isActive('heading', { level: 2 }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Heading 2"
        title="Heading 2"
        tabIndex={0}
      >
        <Heading2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`toolbar-btn ${isActive('heading', { level: 3 }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Heading 3"
        title="Heading 3"
        tabIndex={0}
      >
        <Heading3 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`toolbar-btn ${isActive('paragraph') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Paragraph"
        title="Paragraph"
        tabIndex={0}
      >
        <Pilcrow size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Bold, Italic, Underline, Strikethrough, Highlight */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-btn ${isActive('bold') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Bold"
        title="Bold (Ctrl+B)"
        tabIndex={0}
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-btn ${isActive('italic') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Italic"
        title="Italic (Ctrl+I)"
        tabIndex={0}
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-btn ${isActive('underline') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Underline"
        title="Underline (Ctrl+U)"
        tabIndex={0}
      >
        <Underline size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`toolbar-btn ${isActive('strike') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Strikethrough"
        title="Strikethrough"
        tabIndex={0}
      >
        <Strikethrough size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`toolbar-btn ${isActive('highlight') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Highlight"
        title="Highlight"
        tabIndex={0}
      >
        <Highlighter size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-btn ${isActive('bulletList') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Bullet List"
        title="Bullet List"
        tabIndex={0}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-btn ${isActive('orderedList') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Numbered List"
        title="Numbered List"
        tabIndex={0}
      >
        <ListOrdered size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`toolbar-btn ${isActive('taskList') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Task List"
        title="Task List"
        tabIndex={0}
      >
        <CheckSquare size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Blockquote, Code, Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`toolbar-btn ${isActive('blockquote') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Blockquote"
        title="Blockquote"
        tabIndex={0}
      >
        <Quote size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`toolbar-btn ${isActive('codeBlock') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Code Block"
        title="Code Block"
        tabIndex={0}
      >
        <Code size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="toolbar-btn"
        aria-label="Horizontal Rule"
        title="Horizontal Rule"
        tabIndex={0}
      >
        <Minus size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Link, Image, Table, File */}
      <button
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`toolbar-btn ${isActive('link') ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Insert Link"
        title="Insert Link"
        tabIndex={0}
      >
        <Link size={20} />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="toolbar-btn"
        aria-label="Insert Image"
        title="Insert Image"
        tabIndex={0}
      >
        <Image size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="toolbar-btn"
        aria-label="Insert Table"
        title="Insert Table"
        tabIndex={0}
      >
        <Table size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setFile({})}
        className="toolbar-btn"
        aria-label="Insert File"
        title="Insert File"
        tabIndex={0}
      >
        <FileText size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="toolbar-btn"
        aria-label="Undo"
        title="Undo"
        tabIndex={0}
      >
        <Undo size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="toolbar-btn"
        aria-label="Redo"
        title="Redo"
        tabIndex={0}
      >
        <Redo size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-btn ${isActive({ textAlign: 'left' }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Align Left"
        title="Align Left"
        tabIndex={0}
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-btn ${isActive({ textAlign: 'center' }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Align Center"
        title="Align Center"
        tabIndex={0}
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-btn ${isActive({ textAlign: 'right' }) ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Align Right"
        title="Align Right"
        tabIndex={0}
      >
        <AlignRight size={20} />
      </button>
      <span className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-700 inline-block align-middle" />
      {/* Sort (for tables/lists) */}
      <button
        onClick={() => editor.chain().focus().sortAsc().run()}
        className="toolbar-btn"
        aria-label="Sort Ascending"
        title="Sort Ascending"
        tabIndex={0}
      >
        <ArrowUpNarrowWide size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().sortDesc().run()}
        className="toolbar-btn"
        aria-label="Sort Descending"
        title="Sort Descending"
        tabIndex={0}
      >
        <ArrowDownWideNarrow size={20} />
      </button>
      {/* Publish */}
      <button
        className="toolbar-btn"
        aria-label="Publish"
        title="Publish"
        onClick={props.onPublish}
        tabIndex={0}
      >
        <Upload size={20} />
      </button>
      {/* Preview */}
      <button
        className={`toolbar-btn ${preview ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
        aria-label="Preview"
        title="Preview"
        onClick={() => setPreview ? setPreview(!preview) : onPreview && onPreview()}
        tabIndex={0}
      >
        <Eye size={20} />
      </button>
    </div>
  );
};

export default Toolbar;

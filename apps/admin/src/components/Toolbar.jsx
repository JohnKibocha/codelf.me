import React, { useState } from 'react';
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
  Upload,
  MoreHorizontal,
  ChevronDown,
  Superscript,
  Subscript,
  Palette,
  Calculator,
  AlertTriangle,
  Info,
  Lightbulb,
  Smile,
  Hash,
  GitMerge,
  ZoomIn,
  BarChart3,
  Target,
  Clock,
  Settings
} from 'lucide-react';
import '../styles/medium-like.css';
import { handleImageUpload } from '../lib/imageUpload';
import { handleLinkInsertion, handleMathInsertion } from '../lib/editorModals';

const Toolbar = ({ onPreview, theme, editor, preview, setPreview, ...props }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMathOptions, setShowMathOptions] = useState(false);
  const [showAdmonitionOptions, setShowAdmonitionOptions] = useState(false);
  const [showDiagramOptions, setShowDiagramOptions] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Helper to check if a mark is active
  const isActive = (type, opts) => editor && typeof editor.isActive === 'function' && editor.isActive(type, opts);

  // Button component with responsive text labels
  const ToolbarButton = ({ onClick, isActive = false, icon: Icon, label, shortcut, className = "", ...buttonProps }) => (
    <button
      onClick={onClick}
      className={`medium-toolbar-btn ${isActive ? 'active' : ''} ${className}`}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
      {...buttonProps}
    >
      <Icon size={18} />
      <span className="btn-text hidden md:inline lg:inline">{label}</span>
    </button>
  );

  // Color palette for highlights and text colors
  const colors = [
    { name: 'Yellow', value: '#fef08a', key: 'y' },
    { name: 'Green', value: '#bbf7d0', key: 'g' },
    { name: 'Blue', value: '#dbeafe', key: 'b' },
    { name: 'Pink', value: '#fce7f3', key: 'p' },
    { name: 'Purple', value: '#e9d5ff', key: 'u' },
    { name: 'Orange', value: '#fed7aa', key: 'o' },
  ];

  if (!editor || typeof editor.isActive !== 'function') {
    return (
      <div className="medium-toolbar opacity-60 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <span className="text-sm text-gray-500">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`medium-toolbar ${preview ? 'medium-preview-mode' : ''}`} role="toolbar" aria-label="Editor toolbar">
      {/* Essential formatting tools - always visible */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={isActive('bold')}
          icon={Bold}
          label="Bold"
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={isActive('italic')}
          icon={Italic}
          label="Italic"
          shortcut="Ctrl+I"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={isActive('heading', { level: 2 })}
          icon={Heading2}
          label="Heading"
        />
      </div>

      <div className="medium-toolbar-separator"></div>

      {/* Medium priority tools - visible on tablet+ */}
      <div className="hidden sm:flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={isActive('bulletList')}
          icon={List}
          label="List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={isActive('blockquote')}
          icon={Quote}
          label="Quote"
        />
        <ToolbarButton
          onClick={() => handleLinkInsertion(editor)}
          isActive={isActive('link')}
          icon={Link}
          label="Link"
        />
        <ToolbarButton
          onClick={() => handleImageUpload(editor)}
          icon={Image}
          label="Image"
        />
      </div>

      <div className="medium-toolbar-separator hidden sm:block"></div>

      {/* Advanced tools - desktop only or in dropdown */}
      <div className="hidden lg:flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={isActive('heading', { level: 1 })}
          icon={Heading1}
          label="H1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={isActive('heading', { level: 3 })}
          icon={Heading3}
          label="H3"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={isActive('strike')}
          icon={Strikethrough}
          label="Strike"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={isActive('orderedList')}
          icon={ListOrdered}
          label="Numbers"
        />
        
        {/* Advanced Typography */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={isActive('superscript')}
          icon={Superscript}
          label="Super"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={isActive('subscript')}
          icon={Subscript}
          label="Sub"
        />
        
        {/* Color Picker Dropdown */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            icon={Palette}
            label="Colors"
          />
          {showColorPicker && (
            <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 p-3">
              <div className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Highlight Colors</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: color.value }).run();
                      setShowColorPicker(false);
                    }}
                    title={`${color.name} Highlight (Ctrl+Shift+${color.key})`}
                  />
                ))}
              </div>
              <button
                className="w-full text-xs py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowColorPicker(false);
                }}
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>

        {/* Math Dropdown */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowMathOptions(!showMathOptions)}
            icon={Calculator}
            label="Math"
          />
          {showMathOptions && (
            <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 min-w-[160px]">
              <div className="p-2 space-y-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  onClick={() => {
                    handleMathInsertion(editor, 'inline');
                    setShowMathOptions(false);
                  }}
                >
                  Inline Math ($x^2$)
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  onClick={() => {
                    handleMathInsertion(editor, 'block');
                    setShowMathOptions(false);
                  }}
                >
                  Block Math ($$x^2$$)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admonition Dropdown */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowAdmonitionOptions(!showAdmonitionOptions)}
            icon={Info}
            label="Callouts"
          />
          {showAdmonitionOptions && (
            <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 min-w-[160px]">
              <div className="p-2 space-y-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    editor.chain().focus().setAdmonition('note').run();
                    setShowAdmonitionOptions(false);
                  }}
                >
                  <Info size={16} className="text-blue-500" />
                  Note
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    editor.chain().focus().setAdmonition('warning').run();
                    setShowAdmonitionOptions(false);
                  }}
                >
                  <AlertTriangle size={16} className="text-yellow-500" />
                  Warning
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    editor.chain().focus().setAdmonition('tip').run();
                    setShowAdmonitionOptions(false);
                  }}
                >
                  <Lightbulb size={16} className="text-green-500" />
                  Tip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Diagram Dropdown */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowDiagramOptions(!showDiagramOptions)}
            icon={GitMerge}
            label="Diagrams"
          />
          {showDiagramOptions && (
            <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 min-w-[180px]">
              <div className="p-2 space-y-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    if (editor?.chain?.().focus?.().insertMermaidDiagram) {
                      editor.chain().focus().insertMermaidDiagram('flowchart').run();
                    }
                    setShowDiagramOptions(false);
                  }}
                >
                  📊 Flowchart
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    if (editor?.chain?.().focus?.().insertMermaidDiagram) {
                      editor.chain().focus().insertMermaidDiagram('sequence').run();
                    }
                    setShowDiagramOptions(false);
                  }}
                >
                  🔄 Sequence
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    if (editor?.chain?.().focus?.().insertMermaidDiagram) {
                      editor.chain().focus().insertMermaidDiagram('gantt').run();
                    }
                    setShowDiagramOptions(false);
                  }}
                >
                  📅 Gantt Chart
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    if (editor?.chain?.().focus?.().insertMermaidDiagram) {
                      editor.chain().focus().insertMermaidDiagram('pie').run();
                    }
                    setShowDiagramOptions(false);
                  }}
                >
                  🥧 Pie Chart
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => {
                    if (editor?.chain?.().focus?.().insertMermaidDiagram) {
                      editor.chain().focus().insertMermaidDiagram('mindmap').run();
                    }
                    setShowDiagramOptions(false);
                  }}
                >
                  🧠 Mind Map
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Table */}
        <ToolbarButton
          onClick={() => {
            if (editor?.chain?.().focus?.().insertAdvancedTable) {
              editor.chain().focus().insertAdvancedTable(3, 3).run();
            }
          }}
          icon={BarChart3}
          label="Table+"
        />

        {/* Code Language Picker */}
        <ToolbarButton
          onClick={() => {
            if (editor?.chain?.().focus?.().openLanguagePicker) {
              editor.chain().focus().openLanguagePicker().run();
            }
          }}
          icon={Code}
          label="Code"
          shortcut="Ctrl+Alt+C"
        />

        {/* Focus Mode */}
        <ToolbarButton
          onClick={() => {
            if (editor?.chain?.().focus?.().toggleFocusMode) {
              editor.chain().focus().toggleFocusMode().run();
            }
            setFocusMode(!focusMode);
          }}
          isActive={focusMode}
          icon={Target}
          label="Focus"
          shortcut="Ctrl+Shift+F"
          className="focus-mode-btn"
        />

        {/* Word Count Toggle */}
        <ToolbarButton
          onClick={() => setShowWordCount(!showWordCount)}
          isActive={showWordCount}
          icon={BarChart3}
          label="Stats"
        />
      </div>

      {/* Word Count Display */}
      {showWordCount && (
        <div className="word-count-display" style={{ 
          position: 'absolute', 
          top: '100%', 
          right: '0', 
          marginTop: '8px',
          width: '200px',
          zIndex: 40
        }}>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Words:</span>
              <span className="font-medium">{editor?.storage?.wordCounter?.wordCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Characters:</span>
              <span className="font-medium">{editor?.storage?.characterCount?.characters || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Reading time:</span>
              <span className="font-medium">{editor?.storage?.wordCounter?.readingTime || 0} min</span>
            </div>
            <div className="save-status text-xs mt-2">
              Last saved: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* More options dropdown for mobile/tablet */}
      <div className="relative lg:hidden">
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="medium-toolbar-btn"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
          <span className="btn-text hidden md:inline">More</span>
        </button>
        
        {showMoreOptions && (
          <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 min-w-[200px] max-h-96 overflow-y-auto">
            <div className="p-2 space-y-1">
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('heading', { level: 1 })}
                icon={Heading1}
                label="Heading 1"
                className="w-full justify-start"
              />
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('heading', { level: 3 })}
                icon={Heading3}
                label="Heading 3"
                className="w-full justify-start"
              />
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleStrike().run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('strike')}
                icon={Strikethrough}
                label="Strikethrough"
                className="w-full justify-start"
              />
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('orderedList')}
                icon={ListOrdered}
                label="Numbered List"
                className="w-full justify-start"
              />
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleSuperscript().run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('superscript')}
                icon={Superscript}
                label="Superscript"
                className="w-full justify-start"
              />
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().toggleSubscript().run();
                  setShowMoreOptions(false);
                }}
                isActive={isActive('subscript')}
                icon={Subscript}
                label="Subscript"
                className="w-full justify-start"
              />
              <div className="block sm:hidden space-y-1">
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                    setShowMoreOptions(false);
                  }}
                  isActive={isActive('bulletList')}
                  icon={List}
                  label="Bullet List"
                  className="w-full justify-start"
                />
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                    setShowMoreOptions(false);
                  }}
                  isActive={isActive('blockquote')}
                  icon={Quote}
                  label="Quote"
                  className="w-full justify-start"
                />
                <ToolbarButton
                  onClick={() => {
                    handleLinkInsertion(editor);
                    setShowMoreOptions(false);
                  }}
                  isActive={isActive('link')}
                  icon={Link}
                  label="Link"
                  className="w-full justify-start"
                />
                <ToolbarButton
                  onClick={() => {
                    handleImageUpload(editor);
                    setShowMoreOptions(false);
                  }}
                  icon={Image}
                  label="Image"
                  className="w-full justify-start"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1">
        <ToolbarButton
          onClick={() => setPreview ? setPreview(!preview) : onPreview && onPreview()}
          isActive={preview}
          icon={Eye}
          label="Preview"
          className="preview"
        />
        
        {props.onPublish && (
          <ToolbarButton
            onClick={props.onPublish}
            icon={Upload}
            label="Publish"
            className="publish"
          />
        )}
      </div>
    </div>
  );
};

export default Toolbar;

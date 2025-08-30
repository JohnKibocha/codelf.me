import React, { useEffect } from "react";
import Tag from './ui/Tag';
import DOMPurify from 'dompurify';
import '../styles/medium-like.css';

/**
 * ArticlePreview renders blog/article content in a Medium-like, readable layout.
 */
const ArticlePreview = ({ html, onEdit, meta, title, date, category, tags, username, avatar, onBack, darkTheme }) => {
  useEffect(() => {
    // Add copy button to all code blocks
    const blocks = document.querySelectorAll('pre code');
    blocks.forEach(block => {
      const pre = block.parentElement;
      if (!pre.querySelector('.copy-btn')) {
        const btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.className = 'copy-btn absolute top-2 right-2 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10';
        btn.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(block.innerText);
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        };
        pre.classList.add('relative');
        pre.appendChild(btn);
      }
    });
  }, [html]);

  // Compose meta fields from props or fallback to meta
  const displayTitle = title || meta?.title || 'Untitled Article';
  const displayDate = date || meta?.date || meta?.publishedAt || meta?.$createdAt;
  const displayCategory = category || meta?.category;
  const displayTags = (tags && tags.length > 0 ? tags : (meta?.tags || []));
  const displayAuthor = username || meta?.author || 'Anonymous';
  const displayAvatar = avatar || meta?.authorImage || '';

  // Sanitize HTML for XSS protection
  const safeHtml = DOMPurify.sanitize(html);



  // Render tags using Tag component
  return (
    <div
      className={`medium-editor-container${darkTheme ? ' dark' : ''}`}
      data-theme={darkTheme ? 'dark' : 'light'}
    >
      {/* Only show Edit button if onEdit is provided - Back button is handled by PageBackNav */}
      {onEdit && (
        <div className="absolute z-50 top-4 right-4">
          <button
            className="bg-white/80 dark:bg-gray-900/80 px-3 py-2 rounded shadow flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => {
              if (onEdit) {
                onEdit();
              } else if (window && window.location) {
                window.location.hash = '#/canvas';
              }
            }}
            aria-label="Edit Article"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-2a2 2 0 012-2h2a2 2 0 012 2v2h6" /></svg>
            Edit
          </button>
        </div>
      )}
      
      <article className="medium-article"
      >
        {meta?.coverImage && (
            <div className="w-full aspect-[2.5/1] mb-8 overflow-hidden rounded-lg">
              <img src={meta.coverImage} alt={displayTitle} className="w-full h-full object-cover" />
            </div>
        )}
        <header className="pt-8 pb-8 px-4 md:px-0 border-b border-gray-200 dark:border-gray-800 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white mb-4">
            {displayTitle}
          </h1>
          {meta?.subtitle && (
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-normal mb-2">{meta.subtitle}</h2>
          )}
          <div className="flex items-center gap-3 mt-4">
            {displayAvatar && <img src={displayAvatar} alt={displayAuthor} className="w-16 h-16 rounded-full object-cover" />}
            <div>
              <div className="text-base font-medium text-gray-800 dark:text-gray-200">{displayAuthor}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{displayDate ? new Date(displayDate).toLocaleDateString() : ''}</div>
            </div>
          </div>
          {displayCategory && (
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold text-xs text-gray-600 dark:text-gray-300">Category:</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{displayCategory}</span>
            </div>
          )}
          {displayTags && displayTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="font-semibold text-xs text-gray-600 dark:text-gray-300">Tags:</span>
              {displayTags.map((tag, i) => (
                <Tag key={i} color="blue" size="sm">{tag}</Tag>
              ))}
            </div>
          )}
        </header>
        <section className="px-4 md:px-0 pb-24">
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </section>
      </article>
    </div>
  );
};

export default ArticlePreview;

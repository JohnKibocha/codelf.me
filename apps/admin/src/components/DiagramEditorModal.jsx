// Diagram Editor Modal for Mermaid diagrams
import React, { useState } from 'react';

export const DiagramEditorModal = ({ isOpen, onClose, onSave, initialCode = '', diagramType = 'flowchart' }) => {
  const [code, setCode] = useState(initialCode);
  const [selectedType, setSelectedType] = useState(diagramType);

  const diagramTypes = [
    {
      id: 'flowchart',
      name: 'Flowchart',
      icon: '📊',
      description: 'Process flows and decision trees',
      template: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`
    },
    {
      id: 'sequence',
      name: 'Sequence Diagram',
      icon: '🔄',
      description: 'Interactions between entities',
      template: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hello Alice!`
    },
    {
      id: 'gantt',
      name: 'Gantt Chart',
      icon: '📅',
      description: 'Project timelines and schedules',
      template: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research    :a1, 2024-01-01, 30d
    Design      :after a1, 20d`
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      icon: '🥧',
      description: 'Data distribution visualization',
      template: `pie title Favorite Colors
    "Red" : 42
    "Blue" : 35
    "Green" : 23`
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: '🧠',
      description: 'Hierarchical information structure',
      template: `mindmap
  root((Project))
    Planning
      Research
      Analysis
    Development
      Frontend
      Backend
    Testing
      Unit Tests
      Integration`
    }
  ];

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const template = diagramTypes.find(t => t.id === type)?.template || '';
    setCode(template);
  };

  const handleSave = () => {
    onSave(code, selectedType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create Diagram
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Left Panel - Diagram Types */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Diagram Types</h3>
            <div className="space-y-2">
              {diagramTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-all diagram-type-card ${
                    selectedType === type.id ? 'selected' : ''
                  }`}
                >
                  <div className="diagram-type-icon">{type.icon}</div>
                  <div className="diagram-type-name">{type.name}</div>
                  <div className="diagram-type-desc">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {diagramTypes.find(t => t.id === selectedType)?.name} Code
              </h3>
            </div>
            
            <div className="flex-1 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg p-3 
                         bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your diagram code here..."
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            {/* Help Text */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 Tip: Use Mermaid syntax to create your diagram. Visit{' '}
                <a 
                  href="https://mermaid.js.org/syntax/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  mermaid.js.org
                </a>{' '}
                for documentation and examples.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Insert Diagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramEditorModal;

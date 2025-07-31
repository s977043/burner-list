'use client';

import { BurnerItem } from '@/types';
import { useBurnerStore } from '@/store/useBurnerStore';
import { useState } from 'react';

interface SinkListProps {
  items: BurnerItem[];
}

export default function SinkList({ items }: SinkListProps) {
  const { updateItem, deleteItem, promoteItem } = useBurnerStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (item: BurnerItem) => {
    setEditingId(item.id);
    setEditContent(item.content);
  };

  const handleSave = (itemId: string) => {
    updateItem('sink', itemId, { content: editContent });
    setEditingId(null);
  };

  const handleToggleStatus = (item: BurnerItem) => {
    updateItem('sink', item.id, { 
      status: item.status === 'done' ? 'open' : 'done' 
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
        🗂️ Kitchen Sink
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({items.length} items)
        </span>
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No items in the kitchen sink yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-3 border rounded-lg transition-all ${
                item.status === 'done' 
                  ? 'bg-green-50 border-green-200' 
                  : item.status === 'dropped'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleSave(item.id)}
                      />
                      <button
                        onClick={() => handleSave(item.id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.status === 'done'}
                        onChange={() => handleToggleStatus(item)}
                        className="rounded"
                      />
                      <span 
                        className={`flex-1 ${
                          item.status === 'done' 
                            ? 'line-through text-gray-500' 
                            : item.status === 'dropped'
                            ? 'text-gray-400'
                            : 'text-gray-800'
                        }`}
                      >
                        {item.content}
                      </span>
                      {item.status === 'dropped' && (
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Dropped
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {editingId !== item.id && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => promoteItem(item.id)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                      title="Promote to Back Burner"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => deleteItem('sink', item.id)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


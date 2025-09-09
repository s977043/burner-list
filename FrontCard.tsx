'use client';

import { BurnerItem } from './index';
import { useBurnerStore } from './useBurnerStore';
import { useState } from 'react';

interface FrontCardProps {
  item?: BurnerItem;
}

export default function FrontCard({ item }: FrontCardProps) {
  const { addItem, updateItem, deleteItem, addSubtask, toggleSubtaskStatus, demoteItem } = useBurnerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item?.content || '');
  const [newSubtask, setNewSubtask] = useState('');

  const handleSave = () => {
    if (item) {
      updateItem('front', item.id, { content: editContent });
    } else {
      addItem('front', editContent);
    }
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (item && newSubtask.trim()) {
      addSubtask(item.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const completedSubtasks = item?.subtasks?.filter(sub => sub.status === 'done').length || 0;
  const totalSubtasks = item?.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  if (!item && !isEditing) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6 h-64 flex items-center justify-center">
        <button
          onClick={() => setIsEditing(true)}
          className="text-red-600 hover:text-red-800 text-lg font-medium"
        >
          + フロントバーナー項目を追加
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6 h-64 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-red-800 font-bold text-lg">🔥 フロントバーナー</h3>
        {item && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ✏️
            </button>
            <button
              onClick={() => demoteItem(item.id)}
              className="text-red-600 hover:text-red-800 text-sm"
              title="バックバーナーに降格"
            >
              ⬇️
            </button>
            <button
              onClick={() => deleteItem('front', item.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 p-2 border border-red-300 rounded resize-none"
            placeholder="最重要なタスクは何ですか？"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              保存
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : item ? (
        <div className="flex-1 flex flex-col">
          <p className={`text-gray-800 mb-3 ${item.status === 'done' ? 'line-through' : ''}`}>
            {item.content}
          </p>
          
          {totalSubtasks > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>進捗</span>
                <span>{completedSubtasks}/{totalSubtasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {item.subtasks?.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={subtask.status === 'done'}
                  onChange={() => toggleSubtaskStatus(item.id, subtask.id)}
                  className="rounded"
                />
                <span className={`text-sm ${subtask.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                  {subtask.content}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="サブタスクを追加..."
              className="flex-1 px-2 py-1 border border-red-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
            />
            <button
              onClick={handleAddSubtask}
              className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              +
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


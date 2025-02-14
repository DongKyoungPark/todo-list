import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type TodoItemProps = {
  id: string;
  content: string;
  completed: boolean;
  index: number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
};

export default function TodoItem({
  id,
  content,
  completed,
  index,
  onToggle,
  onRemove,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSubmit = () => {
    if (editedContent.trim() !== '') {
      onEdit(id, editedContent);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedContent(content);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-100 p-2 rounded border flex items-center gap-2 hover:bg-gray-200"
        >
          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggle(id)}
              className="h-4 w-4 cursor-pointer"
            />
            {isEditing ? (
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                className="flex-1 p-1 border rounded"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 ${
                  completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {content}
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:text-blue-500"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRemove(id)}
              className="text-gray-500 hover:text-red-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

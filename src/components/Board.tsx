import { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { BoardType, TodoType } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/formatDate';
import TodoItem from './TodoItem';

type BoardProps = {
  board: BoardType;
  index: number;
  updateBoard: (id: string, title: string) => void;
  deleteBoard: (id: string) => void;
  setBoards: (
    boards: BoardType[] | ((prev: BoardType[]) => BoardType[])
  ) => void;
};

export default function Board({
  board,
  index,
  updateBoard,
  deleteBoard,
  setBoards,
}: BoardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [newTodo, setNewTodo] = useState('');

  const handleTitleSubmit = () => {
    updateBoard(board.id, newTitle);
    setIsEditing(false);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: TodoType = {
      id: crypto.randomUUID(),
      content: newTodo,
      completed: false,
      createdAt: formatDate(Date.now()),
    };

    setBoards((prev) =>
      prev.map((b) =>
        b.id === board.id ? { ...b, todos: [...b.todos, todo] } : b
      )
    );
    setNewTodo('');
  };

  const handleToggleTodo = (todoId: string) => {
    setBoards((prev) =>
      prev.map((b) => ({
        ...b,
        todos: b.todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      }))
    );
  };

  const handleRemoveTodo = (todoId: string) => {
    setBoards((prev) =>
      prev.map((b) => ({
        ...b,
        todos: b.todos.filter((todo) => todo.id !== todoId),
      }))
    );
  };

  const handleEditTodo = (todoId: string, newContent: string) => {
    setBoards((prev) =>
      prev.map((b) => ({
        ...b,
        todos: b.todos.map((todo) =>
          todo.id === todoId ? { ...todo, content: newContent } : todo
        ),
      }))
    );
  };

  return (
    <Draggable draggableId={board.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white p-4 rounded-lg shadow-md w-80 hover:bg-gray-50"
        >
          <div
            className="flex justify-between items-center mb-4"
            {...provided.dragHandleProps}
          >
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSubmit();
                    } else if (e.key === 'Escape') {
                      setNewTitle(board.title);
                      setIsEditing(false);
                    }
                  }}
                  className="border p-1 rounded w-full"
                  autoFocus
                />
              ) : (
                <div>
                  <h1 className="text-xs font-bold">
                    {board.createdAt.slice(0, 10)}
                  </h1>
                  <h2 className="text-lg font-semibold">{board.title}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:text-blue-500"
              >
                <PencilIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => deleteBoard(board.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={addTodo} className="mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="새로운 할 일 추가"
              className="w-full p-2 border rounded"
            />
          </form>

          <Droppable droppableId={board.id} type="TODO">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {board.todos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    id={todo.id}
                    content={todo.content}
                    completed={todo.completed}
                    index={index}
                    onToggle={handleToggleTodo}
                    onRemove={handleRemoveTodo}
                    onEdit={handleEditTodo}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

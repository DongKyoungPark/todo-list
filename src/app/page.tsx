'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { BoardType } from '@/types';
import { formatDate } from '@/lib/formatDate';
import Board from '@/components/Board';

export default function Home() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBoards = localStorage.getItem('boards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('boards', JSON.stringify(boards));
    }
  }, [boards, isLoading]);

  const addBoard = () => {
    const newBoard: BoardType = {
      id: crypto.randomUUID(),
      title: '새로운 보드',
      todos: [],
      createdAt: formatDate(Date.now()),
    };
    setBoards([...boards, newBoard]);
  };

  const updateBoard = (boardId: string, newTitle: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId ? { ...board, title: newTitle } : board
      )
    );
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter((board) => board.id !== boardId));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'boards') {
      const newBoards = Array.from(boards);
      const [removed] = newBoards.splice(source.index, 1);
      newBoards.splice(destination.index, 0, removed);
      setBoards(newBoards);
    } else {
      const sourceBoard = boards.find(
        (board) => board.id === source.droppableId
      );
      const destBoard = boards.find(
        (board) => board.id === destination.droppableId
      );

      if (!sourceBoard || !destBoard) return;

      const newBoards = boards.map((board) => {
        if (board.id === source.droppableId) {
          const newTodos = Array.from(board.todos);
          const [removed] = newTodos.splice(source.index, 1);

          if (source.droppableId === destination.droppableId) {
            newTodos.splice(destination.index, 0, removed);
            return { ...board, todos: newTodos };
          }
          return { ...board, todos: newTodos };
        }

        if (board.id === destination.droppableId) {
          const newTodos = Array.from(board.todos);
          const [removed] = sourceBoard.todos.splice(source.index, 1);
          newTodos.splice(destination.index, 0, removed);
          return { ...board, todos: newTodos };
        }

        return board;
      });

      setBoards(newBoards);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {!isLoading && (
        <>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Todo Lists</h1>

            <button
              onClick={addBoard}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              새 보드 추가
            </button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="boards" direction="horizontal" type="BOARD">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-4 flex-wrap"
                >
                  {boards.map((board, index) => (
                    <Board
                      key={board.id}
                      board={board}
                      index={index}
                      updateBoard={updateBoard}
                      deleteBoard={deleteBoard}
                      setBoards={setBoards}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
    </div>
  );
}

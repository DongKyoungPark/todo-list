export type TodoType = {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
};

export type BoardType = {
  id: string;
  title: string;
  todos: TodoType[];
  createdAt: string;
};

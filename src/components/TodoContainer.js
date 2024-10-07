import React from "react";
import TodoList from "./TodoList";
import useTodos from "../hooks/useTodos";

const TodoContainer = () => {
  const { todos } = useTodos();

  return <TodoList todos={todos} />;
};

export default TodoContainer;

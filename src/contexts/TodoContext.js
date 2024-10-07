import React, { useState, useEffect, createContext } from "react";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTodo, setEditingTodo] = useState({});

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));

    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      localStorage.removeItem("todos");
    }
  }, [todos]);

  const addTodo = (newTodo) => {
    if (isEdit) {
      const todoList = todos.filter((todo) => todo.id !== newTodo.id);
      setTodos([...todoList, newTodo]);
      setIsEdit(false);
    } else {
      setTodos([...todos, newTodo]);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        isEdit,
        setIsEdit,
        editingTodo,
        setEditingTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;

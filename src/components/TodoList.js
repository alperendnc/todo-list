import React, { useState } from "react";
import { TodoItem, TodoForm } from "./";
import useTodos from "../hooks/useTodos";
import { filterTasksByDate } from "../hooks/useFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function TodoList({ filterType }) {
  const { todos } = useTodos();
  const todoList = todos || [];
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTodos = filterTasksByDate(todoList, filterType).filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="todo-container">
      <div className="search-bar-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      <TodoForm />

      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <p>No tasks found</p>
        )}
      </ul>
    </div>
  );
}

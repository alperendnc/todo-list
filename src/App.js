import React, { useState } from "react";
import { TodoProvider } from "./contexts/TodoContext";
import "./App.css";
import TodoList from "./components/TodoList";
import Navbar from "./components/Navbar";

function App() {
  const [filterType, setFilterType] = useState("all");

  return (
    <TodoProvider>
      <Navbar setFilterType={setFilterType} />
      <div className="App">
        <TodoList filterType={filterType} />
      </div>
    </TodoProvider>
  );
}

export default App;

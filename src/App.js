import React, { useState } from "react";
import { TodoProvider } from "./contexts/TodoContext";
import "./App.css";
import TodoList from "./components/TodoList";
import Navbar from "./components/Navbar";
import { FirebaseProvider } from "./contexts/FirebaseContext";

function App() {
  const [filterType, setFilterType] = useState("all");

  return (
    <FirebaseProvider>
      <TodoProvider>
        <Navbar setFilterType={setFilterType} />
        <div className="App">
          <TodoList filterType={filterType} />
        </div>
      </TodoProvider>
    </FirebaseProvider>
  );
}

export default App;

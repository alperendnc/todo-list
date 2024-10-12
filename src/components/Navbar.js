import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCalendarAlt,
  faHome,
  faList,
  faHistory,
  faTrash, // faTrash burada düzgünce tanımlandı.
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ setFilterType }) => {
  const [showInput, setShowInput] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleNewListClick = () => {
    setShowInput(!showInput);
  };

  const handleAddTask = () => {
    if (taskName.trim()) {
      setTasks([...tasks, taskName]);
      setTaskName("");
      setShowInput(false);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => setFilterType("all")}>
          <FontAwesomeIcon className="nav-icon" icon={faHome} />
          Main Menu
        </li>
        <li onClick={() => setFilterType("today")}>
          <FontAwesomeIcon className="nav-icon" icon={faCalendarDay} />
          Today
        </li>
        <li onClick={() => setFilterType("upcoming")}>
          <FontAwesomeIcon className="nav-icon" icon={faCalendarAlt} />
          Upcoming
        </li>
        <li onClick={() => setFilterType("past")}>
          <FontAwesomeIcon className="nav-icon" icon={faHistory} />
          Past
        </li>
        <div className="nav-divider"></div>
        <li onClick={handleNewListClick}>
          <FontAwesomeIcon className="nav-icon" icon={faList} />
          <div>New List</div>
        </li>
      </ul>

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter list name"
            className="new-list-input"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button onClick={handleAddTask} className="add-button">
            Add
          </button>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="list-item">
            <span>{task}</span>
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => handleDeleteTask(index)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

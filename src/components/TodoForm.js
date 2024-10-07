import { useEffect, useState } from "react";
import useTodos from "../hooks/useTodos";
import { v4 as uuidv4 } from "uuid";

const TodoForm = () => {
  const { addTodo, editingTodo, isEdit } = useTodos();

  const defaultValues = {
    id: "",
    title: "",
    description: "",
    completed: false,
    note: "",
    date: "",
    priority: "",
  };

  const [task, setTask] = useState(defaultValues);
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isPriorityDropdownVisible, setIsPriorityDropdownVisible] =
    useState(false);

  useEffect(() => {
    if (isEdit) {
      setTask(editingTodo);
      setIsTaskInputVisible(true);
    }
  }, [editingTodo, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = isEdit ? editingTodo.id : uuidv4();
    addTodo({ ...task, id });
    setTask(defaultValues);
    setIsTaskInputVisible(false);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  const togglePriorityDropdown = () => {
    setIsPriorityDropdownVisible(!isPriorityDropdownVisible);
  };

  const handlePrioritySelect = (priority) => {
    setTask({ ...task, priority });
    setIsPriorityDropdownVisible(false);
  };

  return (
    <div className="todo-form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          {!isTaskInputVisible ? (
            <h3
              className="add-task"
              onClick={() => setIsTaskInputVisible(true)}
            >
              Add Task
            </h3>
          ) : (
            <input
              type="text"
              placeholder="Enter task title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              autoFocus
            />
          )}
        </div>

        {isTaskInputVisible && task.title !== "" && (
          <div className="add-buttons">
            <button type="button" onClick={togglePriorityDropdown}>
              {task.priority ? `Priority: ${task.priority}` : "Set Priority"}
            </button>
            <button type="button" onClick={() => openModal("date")}>
              Add Date
            </button>
            <button type="button" onClick={() => openModal("note")}>
              Add Note
            </button>
            <button type="button" onClick={() => openModal("description")}>
              Add Description
            </button>
            <button type="submit">{isEdit ? "Edit Task" : "Add Task"}</button>
          </div>
        )}

        {isPriorityDropdownVisible && (
          <div className="priority-dropdown">
            <ul>
              <li onClick={() => handlePrioritySelect("Low")}>
                <span
                  className="priority-circle"
                  style={{ backgroundColor: "green" }}
                ></span>
                Low
              </li>
              <li onClick={() => handlePrioritySelect("Medium")}>
                <span
                  className="priority-circle"
                  style={{ backgroundColor: "orange" }}
                ></span>
                Medium
              </li>
              <li onClick={() => handlePrioritySelect("High")}>
                <span
                  className="priority-circle"
                  style={{ backgroundColor: "red" }}
                ></span>
                High
              </li>
            </ul>
          </div>
        )}
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {modalContent === "date"
                ? "Add Date"
                : modalContent === "note"
                ? "Add Note"
                : "Add Description"}
            </h2>
            <form onSubmit={handleModalSubmit}>
              {modalContent === "date" && (
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => setTask({ ...task, date: e.target.value })}
                />
              )}
              {modalContent === "note" && (
                <textarea
                  placeholder="Enter note"
                  value={task.note}
                  onChange={(e) => setTask({ ...task, note: e.target.value })}
                />
              )}
              {modalContent === "description" && (
                <textarea
                  placeholder="Enter description"
                  value={task.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                />
              )}
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoForm;

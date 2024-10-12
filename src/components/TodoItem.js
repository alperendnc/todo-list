import { useState } from "react";
import useTodos from "../hooks/useTodos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faStickyNote,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const TodoItem = ({ todo }) => {
  const { setIsEdit, setEditingTodo, toggleTodo, deleteTodo } = useTodos();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  if (!todo) return null;

  const handleShowPopup = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleEdit = () => {
    setIsEdit(true);
    setEditingTodo(todo);
    setShowPopup(false);
  };

  const fullText = todo.title;
  const truncatedText =
    fullText.length > 30 ? fullText.slice(0, 30) + "..." : fullText;

  const toggleText = () => setIsExpanded(!isExpanded);

  const fullDescription = todo.description || "";
  const truncatedDescription =
    fullDescription.length > 30
      ? fullDescription.slice(0, 30) + "..."
      : fullDescription;

  const toggleDescription = () => setIsDescExpanded(!isDescExpanded);

  const priorityList = [
    { label: "High", value: "priority-high" },
    { label: "Medium", value: "priority-medium" },
    { label: "Low", value: "priority-low" },
  ];

  const currentPriority = priorityList.find(
    (item) => item.label === todo.priority
  );
  const priorityClass = currentPriority ? currentPriority.value : "";

  return (
    <ul>
      <li
        className={`todo-item ${
          todo.completed ? "completed" : "not-completed"
        } ${priorityClass}`}
      >
        <span onClick={() => toggleTodo(todo.id)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{isExpanded ? fullText : truncatedText}</span>
            {fullText.length > 30 && (
              <span
                className="show-more"
                onClick={toggleText}
                style={{ marginLeft: "10px" }}
              >
                {isExpanded ? "Show less" : "Show more"}
              </span>
            )}
          </div>
        </span>

        {todo.description && (
          <>
            <span className="todo-description">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>
                  {isDescExpanded ? fullDescription : truncatedDescription}
                </span>
                {fullDescription.length > 30 && (
                  <span
                    className="show-more"
                    onClick={toggleDescription}
                    style={{ marginLeft: "10px" }}
                  >
                    {isDescExpanded ? "Show less" : "Show more"}
                  </span>
                )}
              </div>
            </span>
          </>
        )}

        <div className="actions">
          <button onClick={() => handleShowPopup("date")}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </button>
          <button onClick={() => handleShowPopup("note")}>
            <FontAwesomeIcon icon={faStickyNote} />
          </button>
          <button onClick={handleEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={() => deleteTodo(todo.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </li>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{popupContent === "note" ? "Note" : "Date"}</h2>
            <p>
              {popupContent === "note"
                ? todo.note || "No note available"
                : todo.date || "No date available"}
            </p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </ul>
  );
};

export default TodoItem;

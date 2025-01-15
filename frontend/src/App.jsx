import { useEffect, useState } from "react";
import trash from "./assets/trash.svg";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((response) => response.json())
      .then((data) => setTodos(data.todos))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTodoObj = { id: Date.now(), text: newTodo.trim() };
      setTodos([...todos, newTodoObj]);
      setNewTodo("");

      fetch(`http://localhost:5000/create/${newTodoObj.id}`, {
        method: "POST",
        body: JSON.stringify({ text: newTodoObj.text }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.text())
        .then((message) => console.log(message))
        .catch(() => {
          setTodos(todos.filter((todos) => todos.id != newTodoObj.id));
        });
    }
  };
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));

    fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => console.log(res.status))
      .catch(() => {
        setTodos([...todos, { id, text: "failed to delete" }]);
        console.log("trigger");
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <h1 className="cardTitle">Todo List</h1>
      </div>
      <div className="inputDiv">
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="todoInput"
          />
          <button type="submit" className="inputBtn">
            Add
          </button>
        </form>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="delete-button"
            >
              <img src={trash} className="trashIcon"></img>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

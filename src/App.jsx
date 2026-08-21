import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://32.197.163.55:3000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      setTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });

      fetchTodos();
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>AWS Todo App 🚀</h1>
          <p>React + Node.js + Docker + AWS</p>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">Add Todo</button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="todo-section">
          <div className="section-header">
            <h2>My Todos</h2>
            <span>{todos.length} tasks</span>
          </div>

          {loading ? (
            <p className="message">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="message">No todos yet. Add your first task!</p>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <div
                  className={`todo-item ${
                    todo.completed ? "completed" : ""
                  }`}
                  key={todo.id}
                >
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                    />

                    <span>{todo.title}</span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer>
          <p>Deployed on AWS EC2 ☁️</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect, useMemo, useCallback } from "react";

function App() {
  // Issue 2: State management bisa lebih baik
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Gagal memuat data dari localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // Issue 3: useEffect tanpa dependency array yang tepat
  //   useEffect(() => {

  //   const saved = localStorage.getItem('todos')
  // if (saved) {
  //   try {
  //     setTodos(JSON.parse(saved))
  //   } catch (error) {
  //     console.error('Gagal memuat data dari localStorage:', error)
  //     localStorage.removeItem('todos')
  //   }
  // }
  // }, [])

  // Issue 4: useEffect yang terlalu sering run
  // useEffect(() => {
  //   localStorage.setItem('todos', JSON.stringify(todos))
  // })

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (input.trim() === "") {
      alert("Please enter a todo");
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInput("");
  }, [input]);

  const deleteTodo = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const handleInputChange = useCallback((e) => setInput(e.target.value), []);
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        addTodo();
      }
    },
    [addTodo],
  );

  return (
    <div className="app">
      <h1>My Todo List</h1>

      {/* Issue 11: Tidak ada label untuk accessibility */}
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Issue 12: Inline styles (inconsistent dengan CSS file) */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{ background: filter === "all" ? "#28a745" : "#007bff" }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{ background: filter === "active" ? "#28a745" : "#007bff" }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{ background: filter === "completed" ? "#28a745" : "#007bff" }}
        >
          Completed
        </button>
      </div>

      <div className="todo-list">
        {/* Issue 13: Tidak ada handling untuk empty state */}
        {filteredTodos().map((todo) => (
          // Issue 14: Key menggunakan index bisa lebih baik dengan ID
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {/* Issue 15: Potential XSS jika text dari user input */}
            {/* <span dangerouslySetInnerHTML={{ __html: todo.text }} /> */}
            <span className="todo-text">{todo.text}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>
          Total: {stats.total} | Active: {stats.active} | Completed:{" "}
          {stats.completed}
        </p>
      </div>

      {/* Issue 16: Debug code yang tertinggal
      {console.log('Rendering with todos:', todos)}
      {console.log('API Key:', API_KEY)} */}
    </div>
  );
}

export default App;

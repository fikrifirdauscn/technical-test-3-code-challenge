import { useState, useEffect, useMemo, useCallback } from 'react'

function App() {
  // Commit 6: Lazy initial state (Menggantikan useEffect pertama)
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Gagal memuat data dari localStorage:', error)
        return []
      }
    }
    return []
  })
  
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  
  // Commit 3: useEffect dengan dependency array
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])
  
  // Commit 8: useCallback untuk fungsi
  const addTodo = useCallback(() => {
    if (input.trim() === '') {
      alert('Please enter a todo')
      return
    }
    
    // Commit 4: Menggunakan crypto.randomUUID
    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTodos(prevTodos => [...prevTodos, newTodo])
    setInput('')
  }, [input])
  
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }, [])
  
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])
  
  // Commit 7 & 8: Memoize filter dan stats
  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed)
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed)
    }
    return todos
  }, [todos, filter])
  
  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length
    }
  }, [todos])
  
  // Commit 8: Memoize event handler
  const handleInputChange = useCallback((e) => setInput(e.target.value), [])
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }, [addTodo])
  
  return (
    <div className="app">
      <h1>My Todo List</h1>
      
      <div className="input-section">
        <input 
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          aria-label="New todo input"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{ background: filter === 'all' ? '#28a745' : '#007bff' }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          style={{ background: filter === 'active' ? '#28a745' : '#007bff' }}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          style={{ background: filter === 'completed' ? '#28a745' : '#007bff' }}
        >
          Completed
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {/* Commit 1: Menghilangkan XSS */}
            <span>{todo.text}</span>
            <button 
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      <div className="stats">
        <p>Total: {stats.total} | Active: {stats.active} | Completed: {stats.completed}</p>
      </div>
    </div>
  )
}

export default App
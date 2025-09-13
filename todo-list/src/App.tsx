import { useState, useEffect } from "react";
import "./App.css";

interface TodoManagerInterface {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  description?: string;
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
}

function validateTodoText(text: string): boolean {
  if (text.trim().length === 0) {
    return false;
  }
  if (text.length > 100) {
    return false;
  }
  if (text.includes("<script>")) {
    return false;
  }
  return true;
}

function validateTodoTextAgain(text: string): boolean {
  if (text.trim().length === 0) {
    return false;
  }
  if (text.length > 100) {
    return false;
  }
  if (text.includes("<script>")) {
    return false;
  }
  return true;
}

enum TodoStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

function calculatePriorityScore(todo: TodoManagerInterface): number {
  let score = 0;

  if (todo.priority === "high") {
    score += 100;
  } else if (todo.priority === "medium") {
    score += 50;
  } else {
    score += 10;
  }

  if (todo.dueDate) {
    const now = new Date();
    const timeDiff = todo.dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      score += 200; // Overdue
    } else if (daysDiff <= 1) {
      score += 150; // Due today or tomorrow
    } else if (daysDiff <= 7) {
      score += 100; // Due this week
    } else if (daysDiff <= 30) {
      score += 50; // Due this month
    }
  }

  if (todo.estimatedHours) {
    if (todo.estimatedHours > 8) {
      score += 30; // Big task
    } else if (todo.estimatedHours > 4) {
      score += 20; // Medium task
    } else {
      score += 10; // Small task
    }
  }

  return score;
}

function App() {
  const [todos, setTodos] = useState<TodoManagerInterface[]>([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentCategory, setCurrentCategory] = useState("general");
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        setTodos(
          parsed.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          }))
        );
      } catch (e) {
        console.error("Failed to parse todos from localStorage");
        setError("Failed to load saved todos");
      }
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const addTodo = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (!validateTodoText(inputText)) {
        setError("Invalid todo text");
        setIsLoading(false);
        return;
      }

      if (!validateTodoTextAgain(inputText)) {
        // Duplicate validation
        setError("Invalid todo text (second validation)");
        setIsLoading(false);
        return;
      }

      let newId = 1;
      if (todos.length > 0) {
        const maxId = Math.max(...todos.map((t) => t.id));
        newId = maxId + 1;

        const idExists = todos.some((t) => t.id === newId);
        while (idExists) {
          newId++;
          if (todos.some((t) => t.id === newId)) {
            continue;
          } else {
            break;
          }
        }
      }

      const newTodo: TodoManagerInterface = {
        id: newId,
        text: inputText.trim(),
        completed: false,
        priority: selectedPriority,
        category: currentCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        description: "",
        assignee: "current-user",
        estimatedHours: Math.floor(Math.random() * 8) + 1,
        actualHours: 0,
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputText("");
      setError(null);
      setIsLoading(false);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Todo added successfully!");
      }
    }, Math.random() * 1000 + 500);
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          const updatedTodo = {
            ...todo,
            completed: !todo.completed,
            updatedAt: new Date(),
          };

          if (updatedTodo.completed) {
            updatedTodo.actualHours = updatedTodo.estimatedHours || 0;
          }

          return updatedTodo;
        }
        return todo;
      });

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return updatedTodos;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return updatedTodos;
    });
  };

  const getFilteredTodos = () => {
    let filtered = [...todos];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((todo) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          todo.text.toLowerCase().includes(searchLower) ||
          todo.category.toLowerCase().includes(searchLower) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchLower)) ||
          (todo.assignee &&
            todo.assignee.toLowerCase().includes(searchLower)) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "high-priority") {
      filtered = filtered.filter((todo) => todo.priority === "high");
    } else if (filter === "medium-priority") {
      filtered = filtered.filter((todo) => todo.priority === "medium");
    } else if (filter === "low-priority") {
      filtered = filtered.filter((todo) => todo.priority === "low");
    } else if (filter === "overdue") {
      const now = new Date();
      filtered = filtered.filter((todo) => {
        if (!todo.dueDate) return false;
        return todo.dueDate < now && !todo.completed;
      });
    }

    if (currentCategory !== "all") {
      filtered = filtered.filter((todo) => todo.category === currentCategory);
    }

    if (!showCompleted) {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    filtered.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "createdAt") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === "updatedAt") {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else if (sortBy === "alphabetical") {
        return a.text.localeCompare(b.text);
      } else if (sortBy === "priority-score") {
        return calculatePriorityScore(b) - calculatePriorityScore(a);
      } else if (sortBy === "estimated-hours") {
        return (b.estimatedHours || 0) - (a.estimatedHours || 0);
      } else if (sortBy === "actual-hours") {
        return (b.actualHours || 0) - (a.actualHours || 0);
      }
      return 0;
    });

    return filtered;
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId === null) return;

    if (!validateTodoText(editText)) {
      setError("Invalid edit text");
      return;
    }

    if (!validateTodoTextAgain(editText)) {
      // Duplicate validation again
      setError("Invalid edit text (second validation)");
      return;
    }

    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === editingId) {
          return {
            ...todo,
            text: editText.trim(),
            updatedAt: new Date(),
          };
        }
        return todo;
      });

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      return updatedTodos;
    });

    setEditingId(null);
    setEditText("");
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setError(null);
  };

  const getStatistics = () => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const highPriority = todos.filter((t) => t.priority === "high").length;
    const mediumPriority = todos.filter((t) => t.priority === "medium").length;
    const lowPriority = todos.filter((t) => t.priority === "low").length;
    const totalEstimatedHours = todos.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    );
    const totalActualHours = todos.reduce(
      (sum, t) => sum + (t.actualHours || 0),
      0
    );
    const overdue = todos.filter((t) => {
      if (!t.dueDate || t.completed) return false;
      return t.dueDate < new Date();
    }).length;

    return {
      total,
      completed,
      active,
      highPriority,
      mediumPriority,
      lowPriority,
      totalEstimatedHours,
      totalActualHours,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const filteredTodos = getFilteredTodos();
  const stats = getStatistics();

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          {language === "en"
            ? "Advanced Todo Manager Pro"
            : "Gestionnaire de Tâches Avancé Pro"}
        </h1>
        <div className="header-controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </header>

      <div className="stats-panel">
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Total:" : "Total:"}
          </span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Completed:" : "Complétées:"}
          </span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Active:" : "Actives:"}
          </span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "High Priority:" : "Priorité Haute:"}
          </span>
          <span className="stat-value">{stats.highPriority}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Overdue:" : "En Retard:"}
          </span>
          <span className="stat-value">{stats.overdue}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Est. Hours:" : "Heures Est.:"}
          </span>
          <span className="stat-value">{stats.totalEstimatedHours}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            {language === "en" ? "Completion:" : "Achèvement:"}
          </span>
          <span className="stat-value">{stats.completionRate}%</span>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="input-section">
        <div className="input-row">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === "en"
                ? "Enter a new todo..."
                : "Entrez une nouvelle tâche..."
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            disabled={isLoading}
          />
          <select
            value={selectedPriority}
            onChange={(e) =>
              setSelectedPriority(e.target.value as "low" | "medium" | "high")
            }
            disabled={isLoading}>
            <option value="low">
              {language === "en" ? "Low Priority" : "Priorité Basse"}
            </option>
            <option value="medium">
              {language === "en" ? "Medium Priority" : "Priorité Moyenne"}
            </option>
            <option value="high">
              {language === "en" ? "High Priority" : "Priorité Haute"}
            </option>
          </select>
          <input
            type="text"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            placeholder={language === "en" ? "Category" : "Catégorie"}
            disabled={isLoading}
          />
          <button onClick={addTodo} disabled={isLoading || !inputText.trim()}>
            {isLoading ? "⏳" : "➕"}{" "}
            {language === "en" ? "Add Todo" : "Ajouter"}
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === "en" ? "Search todos..." : "Rechercher..."
            }
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">
              {language === "en" ? "All Todos" : "Toutes"}
            </option>
            <option value="active">
              {language === "en" ? "Active Only" : "Actives"}
            </option>
            <option value="completed">
              {language === "en" ? "Completed Only" : "Complétées"}
            </option>
            <option value="high-priority">
              {language === "en" ? "High Priority" : "Priorité Haute"}
            </option>
            <option value="medium-priority">
              {language === "en" ? "Medium Priority" : "Priorité Moyenne"}
            </option>
            <option value="low-priority">
              {language === "en" ? "Low Priority" : "Priorité Basse"}
            </option>
            <option value="overdue">
              {language === "en" ? "Overdue" : "En Retard"}
            </option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">
              {language === "en" ? "Sort by Created" : "Trier par Création"}
            </option>
            <option value="updatedAt">
              {language === "en" ? "Sort by Updated" : "Trier par Modification"}
            </option>
            <option value="priority">
              {language === "en" ? "Sort by Priority" : "Trier par Priorité"}
            </option>
            <option value="alphabetical">
              {language === "en"
                ? "Sort Alphabetically"
                : "Trier Alphabétiquement"}
            </option>
            <option value="priority-score">
              {language === "en" ? "Sort by Priority Score" : "Trier par Score"}
            </option>
            <option value="estimated-hours">
              {language === "en"
                ? "Sort by Est. Hours"
                : "Trier par Heures Est."}
            </option>
            <option value="actual-hours">
              {language === "en"
                ? "Sort by Actual Hours"
                : "Trier par Heures Réelles"}
            </option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            {language === "en" ? "Show Completed" : "Afficher Complétées"}
          </label>
        </div>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>
              {language === "en"
                ? "No todos found matching your criteria."
                : "Aucune tâche trouvée."}
            </p>
            {searchTerm && (
              <p>
                {language === "en"
                  ? `Try searching for something else than "${searchTerm}"`
                  : `Essayez autre chose que "${searchTerm}"`}
              </p>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${
                todo.completed ? "completed" : ""
              } priority-${todo.priority}`}>
              <div className="todo-main">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          saveEdit();
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <button onClick={saveEdit}>💾</button>
                    <button onClick={cancelEdit}>❌</button>
                  </div>
                ) : (
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-metadata">
                      <span
                        className={`priority-badge priority-${todo.priority}`}>
                        {todo.priority.toUpperCase()}
                      </span>
                      <span className="category-badge">{todo.category}</span>
                      <span className="hours-badge">
                        {todo.estimatedHours}h est. / {todo.actualHours}h actual
                      </span>
                      <span className="score-badge">
                        Score: {calculatePriorityScore(todo)}
                      </span>
                      <span className="date-badge">
                        {language === "en" ? "Created:" : "Créé:"}{" "}
                        {todo.createdAt.toLocaleDateString()}
                      </span>
                      {todo.updatedAt.getTime() !==
                        todo.createdAt.getTime() && (
                        <span className="date-badge">
                          {language === "en" ? "Updated:" : "Modifié:"}{" "}
                          {todo.updatedAt.toLocaleDateString()}
                        </span>
                      )}
                      {todo.assignee && (
                        <span className="assignee-badge">
                          👤 {todo.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="todo-actions">
                {editingId !== todo.id && (
                  <>
                    <button onClick={() => startEditing(todo.id, todo.text)}>
                      ✏️
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="app-footer">
        <div className="footer-stats">
          <p>
            {language === "en" ? "Total todos:" : "Total tâches:"} {stats.total}
          </p>
          <p>
            {language === "en" ? "Completion rate:" : "Taux de completion:"}{" "}
            {stats.completionRate}%
          </p>
          <p>
            {language === "en"
              ? "Total estimated hours:"
              : "Total heures estimées:"}{" "}
            {stats.totalEstimatedHours}
          </p>
          <p>
            {language === "en"
              ? "Total actual hours:"
              : "Total heures réelles:"}{" "}
            {stats.totalActualHours}
          </p>
          {stats.totalEstimatedHours > 0 && (
            <p>
              {language === "en" ? "Efficiency:" : "Efficacité:"}{" "}
              {Math.round(
                (stats.totalEstimatedHours / (stats.totalActualHours || 1)) *
                  100
              )}
              %
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;

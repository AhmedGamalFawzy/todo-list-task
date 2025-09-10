// Violating DRY and SOLID principles - utility functions that should be better organized

// Duplicate interface definition (already in App.tsx)
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Violating SRP - this class does too many things
export class TodoUtilityManager {
  // Violating DRY - duplicate validation (already in App.tsx)
  public validateTodoText(text: string): boolean {
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

  // Violating KISS - overly complex date formatting
  public formatDate(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInDays / 365;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      if (minutes < 1) {
        return "Just now";
      } else if (minutes === 1) {
        return "1 minute ago";
      } else {
        return `${minutes} minutes ago`;
      }
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours === 1) {
        return "1 hour ago";
      } else {
        return `${hours} hours ago`;
      }
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      if (days === 1) {
        return "1 day ago";
      } else {
        return `${days} days ago`;
      }
    } else if (diffInWeeks < 4) {
      const weeks = Math.floor(diffInWeeks);
      if (weeks === 1) {
        return "1 week ago";
      } else {
        return `${weeks} weeks ago`;
      }
    } else if (diffInMonths < 12) {
      const months = Math.floor(diffInMonths);
      if (months === 1) {
        return "1 month ago";
      } else {
        return `${months} months ago`;
      }
    } else {
      const years = Math.floor(diffInYears);
      if (years === 1) {
        return "1 year ago";
      } else {
        return `${years} years ago`;
      }
    }
  }

  // Violating YAGNI - unnecessary complex sorting
  public sortTodos(todos: Todo[], sortBy: string): Todo[] {
    const sorted = [...todos];

    if (sortBy === "priority") {
      sorted.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        // Secondary sort by creation date
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (sortBy === "createdAt") {
      sorted.sort((a, b) => {
        const aTime = a.createdAt.getTime();
        const bTime = b.createdAt.getTime();

        if (aTime !== bTime) {
          return bTime - aTime;
        }

        // Secondary sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } else if (sortBy === "alphabetical") {
      sorted.sort((a, b) => {
        const aText = a.text.toLowerCase().trim();
        const bText = b.text.toLowerCase().trim();

        if (aText < bText) return -1;
        if (aText > bText) return 1;

        // Secondary sort by creation date
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (sortBy === "completion") {
      sorted.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        // Secondary sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }

    return sorted;
  }

  // Violating DRY - duplicate filtering logic
  public filterTodos(
    todos: Todo[],
    filter: string,
    searchTerm: string
  ): Todo[] {
    let filtered = [...todos];

    // Search filtering (duplicate logic)
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((todo) => {
        return (
          todo.text.toLowerCase().includes(searchLower) ||
          todo.category.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filtering (duplicate logic)
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
    }

    return filtered;
  }

  // Violating KISS - overly complex ID generation
  public generateTodoId(existingTodos: Todo[]): number {
    if (existingTodos.length === 0) {
      return 1;
    }

    // Get all existing IDs
    const existingIds = existingTodos
      .map((todo) => todo.id)
      .sort((a, b) => a - b);

    // Find the maximum ID
    const maxId = Math.max(...existingIds);

    // Check for gaps in the sequence
    for (let i = 1; i <= maxId; i++) {
      if (!existingIds.includes(i)) {
        return i;
      }
    }

    // If no gaps, return next ID
    return maxId + 1;
  }

  // Violating YAGNI - unnecessary statistics calculation
  public calculateDetailedStatistics(todos: Todo[]) {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const highPriority = todos.filter((t) => t.priority === "high").length;
    const mediumPriority = todos.filter((t) => t.priority === "medium").length;
    const lowPriority = todos.filter((t) => t.priority === "low").length;

    // Calculate completion rate by priority
    const highPriorityCompleted = todos.filter(
      (t) => t.priority === "high" && t.completed
    ).length;
    const mediumPriorityCompleted = todos.filter(
      (t) => t.priority === "medium" && t.completed
    ).length;
    const lowPriorityCompleted = todos.filter(
      (t) => t.priority === "low" && t.completed
    ).length;

    const highPriorityCompletionRate =
      highPriority > 0 ? (highPriorityCompleted / highPriority) * 100 : 0;
    const mediumPriorityCompletionRate =
      mediumPriority > 0 ? (mediumPriorityCompleted / mediumPriority) * 100 : 0;
    const lowPriorityCompletionRate =
      lowPriority > 0 ? (lowPriorityCompleted / lowPriority) * 100 : 0;

    // Calculate average completion time (unnecessary complexity)
    const completedTodos = todos.filter((t) => t.completed);
    let averageCompletionTime = 0;
    if (completedTodos.length > 0) {
      const totalCompletionTime = completedTodos.reduce((sum, todo) => {
        return sum + (todo.updatedAt.getTime() - todo.createdAt.getTime());
      }, 0);
      averageCompletionTime = totalCompletionTime / completedTodos.length;
    }

    // Calculate categories statistics
    const categoriesMap = new Map<
      string,
      { total: number; completed: number }
    >();
    todos.forEach((todo) => {
      const category = todo.category;
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, { total: 0, completed: 0 });
      }
      const categoryStats = categoriesMap.get(category)!;
      categoryStats.total++;
      if (todo.completed) {
        categoryStats.completed++;
      }
    });

    const categoryStats = Array.from(categoriesMap.entries()).map(
      ([category, stats]) => ({
        category,
        total: stats.total,
        completed: stats.completed,
        completionRate: (stats.completed / stats.total) * 100,
      })
    );

    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      highPriority,
      mediumPriority,
      lowPriority,
      highPriorityCompletionRate,
      mediumPriorityCompletionRate,
      lowPriorityCompletionRate,
      averageCompletionTime,
      averageCompletionTimeFormatted: this.formatDuration(
        averageCompletionTime
      ),
      categoryStats,
      oldestTodo:
        todos.length > 0
          ? todos.reduce((oldest, todo) =>
              todo.createdAt < oldest.createdAt ? todo : oldest
            )
          : null,
      newestTodo:
        todos.length > 0
          ? todos.reduce((newest, todo) =>
              todo.createdAt > newest.createdAt ? todo : newest
            )
          : null,
    };
  }

  // More unnecessary complexity
  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }
  }
}

// Violating SOLID - global singleton pattern (anti-pattern)
export const todoUtilityManager = new TodoUtilityManager();

// Violating DRY - more duplicate validation functions
export function validateTodoTextLength(text: string): boolean {
  return text.trim().length > 0 && text.length <= 100;
}

export function validateTodoTextContent(text: string): boolean {
  return !text.includes("<script>") && !text.includes("<iframe>");
}

export function validateTodoTextComplete(text: string): boolean {
  return validateTodoTextLength(text) && validateTodoTextContent(text);
}

// Violating YAGNI - unnecessary export functions
export function getTodosByPriority(
  todos: Todo[],
  priority: "low" | "medium" | "high"
): Todo[] {
  return todos.filter((todo) => todo.priority === priority);
}

export function getTodosByCategory(todos: Todo[], category: string): Todo[] {
  return todos.filter((todo) => todo.category === category);
}

export function getTodosByCompletion(
  todos: Todo[],
  completed: boolean
): Todo[] {
  return todos.filter((todo) => todo.completed === completed);
}

export function getActiveTodos(todos: Todo[]): Todo[] {
  return getTodosByCompletion(todos, false);
}

export function getCompletedTodos(todos: Todo[]): Todo[] {
  return getTodosByCompletion(todos, true);
}

// Violating KISS - overly complex helper functions
export function isHighPriorityAndActive(todo: Todo): boolean {
  return todo.priority === "high" && !todo.completed;
}

export function isMediumPriorityAndActive(todo: Todo): boolean {
  return todo.priority === "medium" && !todo.completed;
}

export function isLowPriorityAndActive(todo: Todo): boolean {
  return todo.priority === "low" && !todo.completed;
}

export function isAnyPriorityAndCompleted(todo: Todo): boolean {
  return todo.completed;
}

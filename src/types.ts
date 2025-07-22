// declare the types used in the application

//Sample user
enum UserRoleEnum {
  ADMIN = "admin",
  CONTRIBUTOR = "contributor",
}

//Task status enum
enum TaskStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

type UserRole = "admin" | "contributor";

// User type
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  role: UserRoleEnum;
};

// Task type
type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User | string;
  author?: string;
  priority?: TaskPriority | string;
  createdAt: Date;
  updatedAt: Date;
};

// Board type
type Board = {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
};

// Kanban board type
type KanbanBoard = {
  id: string;
  title: string;
  description?: string;
  users: User[];
  boards: Board[];
  createdAt: Date;
  updatedAt: Date;
};

// Toast/notification type enum (optional, for undo/alerts)
type ToastType = "success" | "error" | "info" | "warning";

// Task priority enum
enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Toast message/type mapping for BoardView
export const TOAST_MAP: Record<
  TaskStatus,
  { message: string; type: ToastType }
> = {
  [TaskStatus.BACKLOG]: { message: "Moved to Backlog", type: "warning" },
  [TaskStatus.IN_PROGRESS]: { message: "Moved to In Progress", type: "info" },
  [TaskStatus.DONE]: { message: "Marked as Done!", type: "success" },
};

// Exporting types for use in other parts of the application
export { TaskStatus, TaskPriority, UserRoleEnum };
export type { User, UserRole, Task, Board, KanbanBoard, ToastType };

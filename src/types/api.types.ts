// ──── User ────────────────────────────────────────────────────────────────────
export type UserRole = "Admin" | "Manager" | "Member";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  profileImg?: string;
  designation?: string;
  department?: string;
  skills?: string[];
  isActive?: boolean;
  createdAt?: string;
}

// ──── Project ─────────────────────────────────────────────────────────────────
export type ProjectStatus = "planned" | "active" | "completed" | "archived";

export interface IProject {
  _id: string;
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  status: ProjectStatus;
  thumbnail?: string;
  createdBy: IUser;
  members: IUser[];
  createdAt?: string;
}

export interface IProjectStats {
  project: { _id: string; title: string; status: ProjectStatus };
  membersCount: number;
  budget: number;
  timeProgress: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

// ──── Sprint ──────────────────────────────────────────────────────────────────
export interface ISprint {
  _id: string;
  project: string;
  title: string;
  sprintNumber: number;
  startDate?: string;
  endDate?: string;
  order: number;
  createdAt?: string;
}

// ──── Task ────────────────────────────────────────────────────────────────────
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";

export interface ISubtask {
  title: string;
  isCompleted: boolean;
}

export interface ITask {
  _id: string;
  sprint: ISprint | string;
  project: IProject | string;
  title: string;
  description?: string;
  assignees: IUser[];
  estimate?: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  attachments: string[];
  subtasks: ISubtask[];
  reviewRequired: boolean;
  createdAt?: string;
}

// ──── TimeLog ─────────────────────────────────────────────────────────────────
export interface ITimeLog {
  _id: string;
  task: string | ITask;
  user: string | IUser;
  hours: number;
  description?: string;
  date: string;
  createdAt?: string;
}

// ──── API Response ────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

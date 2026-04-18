export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

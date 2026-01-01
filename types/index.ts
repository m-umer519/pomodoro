export type Task = {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  is_completed: boolean;
  priority: number;
  due_date: string | null;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  tasks: Task[]; // We will populate this in our app
};
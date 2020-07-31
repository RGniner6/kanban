export interface Board {
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}

export interface Task {
  label?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  description?: string;
}

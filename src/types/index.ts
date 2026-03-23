export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate?: Date;
  dueDate: Date;
  createdAt: Date;
}

export const USERS: User[] = [
  { id: '1', name: 'Alex Rivera', initials: 'AR', color: '#3b82f6' },
  { id: '2', name: 'Sarah Chen', initials: 'SC', color: '#10b981' },
  { id: '3', name: 'James Wilson', initials: 'JW', color: '#f59e0b' },
  { id: '4', name: 'Elena Rodriguez', initials: 'ER', color: '#ef4444' },
  { id: '5', name: 'Michael Kim', initials: 'MK', color: '#8b5cf6' },
  { id: '6', name: 'Sophie Taylor', initials: 'ST', color: '#ec4899' },
];

export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
export const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const TASK_TITLES = [
  'Fix mobile navigation bug',
  'Implement authentication flow',
  'Design system documentation',
  'Refactor database queries',
  'Add unit tests for API',
  'Optimize image loading',
  'Create landing page mockup',
  'Update privacy policy',
  'Integrate payment gateway',
  'Bug: Dashboard flickering',
  'Feature: Dark mode toggle',
  'User research for new module',
  'Setup CI/CD pipeline',
  'Export report to CSV',
  'Improve SEO performance',
];

export const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const assignee = USERS[Math.floor(Math.random() * USERS.length)];
    
    // Random dates within the current month +/- 15 days
    const daysOffset = Math.floor(Math.random() * 30) - 15;
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + daysOffset);
    
    let startDate: Date | undefined;
    if (Math.random() > 0.2) {
      startDate = new Date(dueDate);
      startDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 7 + 1));
    }

    tasks.push({
      id: `task-${i}`,
      title: `${TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)]} ${i + 1}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status,
      priority,
      assignee,
      startDate,
      dueDate,
      createdAt: new Date(now.getTime() - Math.random() * 1000000000),
    });
  }

  return tasks;
};

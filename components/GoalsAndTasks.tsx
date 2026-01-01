'use client';

import { useState } from 'react';
import { addGoal, addTask, toggleTaskCompletion, deleteTask } from '@/lib/actions';
import type { Goal, Task } from '@/types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function GoalsAndTasks({ initialGoals }: { initialGoals: Goal[] }) {
  const [newGoalName, setNewGoalName] = useState('');

  const handleAddGoal = async () => {
    if (!newGoalName.trim()) return;
    try {
      await addGoal(newGoalName);
      setNewGoalName('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Goal */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Add a New Goal</h3>
          <div className="join w-full">
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g., Learn Next.js"
              className="input input-bordered join-item w-full"
            />
            <button onClick={handleAddGoal} className="btn btn-primary join-item">
              <PlusIcon className="h-5 w-5" />
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Display Goals and Tasks */}
      <div className="space-y-4">
        {initialGoals.map((goal) => (
          <div key={goal.id} className="collapse collapse-plus bg-base-100 shadow">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">{goal.name}</div>
            <div className="collapse-content">
              {/* Task List */}
              <div className="space-y-2 mt-2">
                {goal.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-base-200">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task.id, task.is_completed)}
                      className="checkbox checkbox-primary"
                    />
                    <span className={`flex-grow ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="btn btn-ghost btn-xs">
                        <TrashIcon className="h-4 w-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add Task Form */}
              <form action={addTask} className="join w-full mt-4">
                  <input type="hidden" name="goal_id" value={goal.id} />
                  <input
                      type="text"
                      name="title"
                      placeholder="Add a new task..."
                      className="input input-bordered join-item w-full"
                      required
                  />
                  <button type="submit" className="btn btn-secondary join-item">
                      <PlusIcon className="h-5 w-5" />
                  </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
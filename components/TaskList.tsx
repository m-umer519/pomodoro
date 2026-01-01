"use client";

import { useState } from "react";
import { addTask, deleteTask, toggleTask } from "@/app/actions";
import type { Goal } from "@/types";
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutlineIcon } from '@heroicons/react/24/outline';


interface TaskListProps {
    goal: Goal;
}

export default function TaskList({ goal }: TaskListProps) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask(newTask, goal.id);
      setNewTask("");
    }
  };

  return (
    <div>
      <div className="flex gap-2 my-2">
        <input
          type="text"
          placeholder="Add a new task..."
          className="input input-bordered input-sm w-full"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-secondary btn-sm" onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="space-y-2">
        {goal.tasks.map((task) => (
          <li key={task.id} className={`flex items-center justify-between p-2 rounded-lg ${task.is_completed ? 'bg-base-300' : 'bg-base-100'}`}>
            <span className={`flex-grow ${task.is_completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => toggleTask(task.id, task.is_completed)} className="btn btn-ghost btn-sm btn-circle">
                    {task.is_completed ? <CheckCircleIcon className="h-5 w-5 text-success" /> : <CheckCircleOutlineIcon className="h-5 w-5" />}
                </button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-ghost btn-sm btn-circle text-error">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
          </li>
        ))}
         {goal.tasks.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-4">No tasks yet. Add one!</p>
        )}
      </ul>
    </div>
  );
}
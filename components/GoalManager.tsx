"use client";

import { useState } from "react";
import { addGoal } from "@/app/actions";
import type { Goal } from "@/types";
import TaskList from "./TaskList";

interface GoalManagerProps {
  goals: Goal[];
}

export default function GoalManager({ goals }: GoalManagerProps) {
  const [newGoal, setNewGoal] = useState("");

  const handleAddGoal = async () => {
    if (newGoal.trim()) {
      await addGoal(newGoal);
      setNewGoal("");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New Goal or Project..."
          className="input input-bordered w-full"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddGoal}>Add Goal</button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="goal-accordion" defaultChecked />
            <div className="collapse-title text-xl font-medium">{goal.name}</div>
            <div className="collapse-content">
              <TaskList goal={goal} />
            </div>
          </div>
        ))}
         {goals.length === 0 && (
            <p className="text-center text-gray-500">Create your first goal to get started.</p>
        )}
      </div>
    </div>
  );
}
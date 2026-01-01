"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function addGoal(name: string) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && name) {
    await supabase.from("goals").insert({ name, user_id: user.id });
    revalidatePath("/");
  }
}

export async function addTask(title: string, goalId: string) {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && title && goalId) {
        await supabase.from("tasks").insert({ title, goal_id: goalId, user_id: user.id });
        revalidatePath("/");
    }
}

export async function toggleTask(id: string, is_completed: boolean) {
    const supabase = createServerSupabaseClient();
    await supabase.from("tasks").update({ is_completed: !is_completed }).match({ id });
    revalidatePath("/");
}

export async function deleteTask(id: string) {
    const supabase = createServerSupabaseClient();
    await supabase.from("tasks").delete().match({ id });
    revalidatePath("/");
}


export async function logPomodoroSession(taskId: string, durationMinutes: number) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !taskId) return;

  // First, get the goal_id from the task
  const { data: task } = await supabase
    .from("tasks")
    .select("goal_id")
    .eq("id", taskId)
    .single();

  if (!task) return;

  await supabase.from("pomodoro_sessions").insert({
    user_id: user.id,
    task_id: taskId,
    goal_id: task.goal_id,
    duration_minutes: durationMinutes,
  });

  revalidatePath("/analytics"); // Refresh analytics page data
}
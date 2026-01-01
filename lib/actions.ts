'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Helper to create a Supabase client for server actions
const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

export async function addGoal(name: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to add a goal.');
  }

  const { error } = await supabase.from('goals').insert({ name, user_id: user.id });

  if (error) {
    throw new Error(`Failed to add goal: ${error.message}`);
  }
  
  revalidatePath('/');
}

export async function addTask(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to add a task.');
  }

  const rawFormData = {
    title: formData.get('title') as string,
    goal_id: formData.get('goal_id') as string || null,
  };
  
  if (!rawFormData.title) {
      throw new Error('Task title cannot be empty.');
  }

  const { error } = await supabase.from('tasks').insert({ ...rawFormData, user_id: user.id });

  if (error) {
    throw new Error(`Failed to add task: ${error.message}`);
  }

  revalidatePath('/');
}

export async function toggleTaskCompletion(id: string, is_completed: boolean) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('tasks').update({ is_completed: !is_completed }).match({ id });

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  revalidatePath('/');
}

export async function deleteTask(id: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('tasks').delete().match({ id });

    if (error) {
        throw new Error(`Failed to delete task: ${error.message}`);
    }

    revalidatePath('/');
}

export async function logPomodoroSession(formData: FormData) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error('You must be logged in to log a session.');
    }

    const rawFormData = {
        task_id: formData.get('task_id') as string || null,
        duration_minutes: parseInt(formData.get('duration_minutes') as string, 10),
    };

    if (isNaN(rawFormData.duration_minutes)) {
        throw new Error('Invalid duration.');
    }

    const { error } = await supabase.from('pomodoro_sessions').insert({ ...rawFormData, user_id: user.id });

    if (error) {
        throw new Error(`Failed to log session: ${error.message}`);
    }
}
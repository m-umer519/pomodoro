import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import PomodoroTimer from "@/components/PomodoroTimer";
import Header from '@/components/Header';
import GoalsAndTasks from '@/components/GoalsAndTasks';
import type { Goal, Task } from '@/types';

export default async function Home() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch goals and tasks
  const { data: goalsData, error: goalsError } = await supabase.from('goals').select('*, tasks(*)');

  if (goalsError) {
    console.error("Error fetching data:", goalsError);
  }

  const goals: Goal[] = goalsData || [];
  const allTasks: Task[] = goals.flatMap(g => g.tasks);

  return (
    <>
      <Header email={session?.user?.email} />
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Goals & Tasks</h2>
          <GoalsAndTasks initialGoals={goals} />
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Timer</h2>
          <PomodoroTimer tasks={allTasks.filter(t => !t.is_completed)} />
        </div>
      </main>
    </>
  );
}
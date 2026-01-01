import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { subDays, format } from 'date-fns';
import Header from "@/components/Header";
import ProductivityChart from "@/components/ProductivityChart";
import GoalBreakdown from "@/components/GoalBreakdown";

export const dynamic = 'force-dynamic';

function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );
}

export default async function AnalyticsPage() {
    const supabase = getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();

    // Fetch sessions from the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
    const { data: sessions } = await supabase
        .from("pomodoro_sessions")
        .select(`*, goals (name)`)
        .gte("completed_at", thirtyDaysAgo)
        .order("completed_at", { ascending: false });

    // Process data for ProductivityChart
    const dailyProductivity: { [key: string]: number } = {};
    for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), 'MMM d');
        dailyProductivity[date] = 0;
    }
    sessions?.forEach(session => {
        const date = format(new Date(session.completed_at), 'MMM d');
        if (dailyProductivity[date] !== undefined) {
            dailyProductivity[date] += session.duration_minutes;
        }
    });
    const chartData = Object.keys(dailyProductivity).map(date => ({
        date,
        minutes: dailyProductivity[date]
    })).reverse();


    // Process data for GoalBreakdown
    const goalProductivity: { [key: string]: number } = {};
    sessions?.forEach(session => {
        const goalName = session.goals?.name || 'Uncategorized';
        if (!goalProductivity[goalName]) {
            goalProductivity[goalName] = 0;
        }
        goalProductivity[goalName] += session.duration_minutes;
    });
     const breakdownData = Object.keys(goalProductivity).map(name => ({
        name,
        minutes: goalProductivity[name]
    }));


    return (
        <main>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Your Productivity Dashboard</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Productivity (Last 30 Days)</h2>
                            <ProductivityChart data={chartData} />
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Time Spent Per Goal</h2>
                            <GoalBreakdown data={breakdownData} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
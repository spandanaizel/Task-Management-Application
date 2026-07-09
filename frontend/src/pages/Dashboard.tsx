import { useQuery } from "@tanstack/react-query";
import { ListChecks, CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { taskService } from "@/services/taskService";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "@/types";

const STATUS_COLORS: Record<string, string> = { todo: "#94A3B8", "in-progress": "#2563EB", completed: "#22C55E" };
const PRIORITY_COLORS: Record<string, string> = { low: "#22C55E", medium: "#F59E0B", high: "#EF4444" };

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: taskService.getStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  const stats = data?.stats;
  const statusData = (data?.statusDistribution || []).map((d) => ({ name: d._id, value: d.count }));
  const priorityData = (data?.priorityDistribution || []).map((d) => ({ name: d._id, value: d.count }));
  const weeklyData = (data?.weeklyCreated || []).map((d) => ({ date: d._id.slice(5), count: d.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your team's task activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Tasks" value={stats?.total || 0} icon={ListChecks} color="bg-primary" delay={0} />
        <StatCard label="Completed" value={stats?.completed || 0} icon={CheckCircle2} color="bg-green-500" delay={0.05} />
        <StatCard label="Pending" value={stats?.pending || 0} icon={Clock} color="bg-slate-400" delay={0.1} />
        <StatCard label="In Progress" value={stats?.inProgress || 0} icon={Loader2} color="bg-blue-400" delay={0.15} />
        <StatCard label="High Priority" value={stats?.highPriority || 0} icon={AlertTriangle} color="bg-red-500" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Task Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tasks This Week</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Priority Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[entry.name] || "#2563EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={3} className="px-5 py-4"><Skeleton className="h-5 w-full" /></td></tr>
              ) : (
                data?.users?.map((u: any) => (
                  <tr key={u._id}>
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3"><Badge variant={u.role === "admin" ? "destructive" : "secondary"}>{u.role}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

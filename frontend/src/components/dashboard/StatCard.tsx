import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

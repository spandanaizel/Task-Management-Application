import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileMutation = useMutation({
    mutationFn: () => api.put("/users/profile", { name }),
    onSuccess: () => toast.success("Profile updated"),
    onError: () => toast.error("Failed to update profile"),
  });

  const passwordMutation = useMutation({
    mutationFn: () => api.put("/users/change-password", { currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password updated");
      setCurrentPassword(""); setNewPassword("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update password"),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button onClick={() => passwordMutation.mutate()} disabled={passwordMutation.isPending}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}

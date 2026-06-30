"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Globe, Save, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    email: true, sms: false, push: true, appointments: true, labResults: true, billing: true
  });
  const [system, setSystem] = useState({
    hospitalName: "City General Hospital", timezone: "America/New_York", language: "en", dateFormat: "MM/DD/YYYY"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      setProfile({ firstName: u.firstName || "", lastName: u.lastName || "", email: u.email || "", phone: u.phone || "" });
    }
    // Load saved avatar
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setAvatarPreview(savedAvatar);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
      localStorage.setItem("avatar", result);
      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"));
      toast.success("Photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...profile };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Profile updated!");
  };

  const handleChangePassword = async () => {
    if (!passwords.current) { toast.error("Enter current password"); return; }
    if (passwords.newPass.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwords.newPass })
      });
      if (res.ok) {
        toast.success("Password changed!");
        setPasswords({ current: "", newPass: "", confirm: "" });
      } else { toast.error("Failed"); }
    } catch { toast.error("Error"); }
    finally { setLoading(false); }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    toast.success("Preferences saved!");
  };

  const handleSaveSystem = () => {
    localStorage.setItem("systemSettings", JSON.stringify(system));
    toast.success("System settings saved!");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account and preferences</p></div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="system"><Globe className="h-4 w-4 mr-2" />System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {(avatarPreview || localStorage.getItem("avatar")) && (
                      <AvatarImage src={avatarPreview || localStorage.getItem("avatar") || ""} />
                    )}
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.firstName?.[0] || "U"}{profile.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 shadow-lg" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Input title="Input field" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{user?.role || "User"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click avatar to upload photo</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>First Name</Label><Input title="Input field" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input title="Input field" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} /></div>
                <div className="space-y-2"><Label>Email</Label><Input title="Input field" value={profile.email} disabled className="bg-muted" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input title="Input field" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
              </div>
              <Button onClick={handleSaveProfile} className="gap-2"><Save className="h-4 w-4" />Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input title="Input field" type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} /></div>
              <div className="space-y-2"><Label>New Password</Label><Input title="Input field" type="password" value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input title="Input field" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} /></div>
              <Button onClick={handleChangePassword} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email Notifications", key: "email" as const },
                { label: "SMS Notifications", key: "sms" as const },
                { label: "Push Notifications", key: "push" as const },
                { label: "Appointment Reminders", key: "appointments" as const },
                { label: "Lab Results", key: "labResults" as const },
                { label: "Billing Alerts", key: "billing" as const },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <Label>{item.label}</Label>
                  <Switch checked={notifications[item.key]} onCheckedChange={(c) => setNotifications({...notifications, [item.key]: c})} />
                </div>
              ))}
              <Button onClick={handleSaveNotifications} className="gap-2"><Save className="h-4 w-4" />Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader><CardTitle>System Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Hospital Name</Label><Input title="Input field" value={system.hospitalName} onChange={e => setSystem({...system, hospitalName: e.target.value})} /></div>
                <div className="space-y-2"><Label>Timezone</Label>
                  <select aria-label="Select option" title="Select option" value={system.timezone} onChange={e => setSystem({...system, timezone: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                    <option value="America/New_York">Eastern</option><option value="America/Chicago">Central</option><option value="America/Denver">Mountain</option><option value="America/Los_Angeles">Pacific</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Language</Label>
                  <select aria-label="Select option" title="Select option" value={system.language} onChange={e => setSystem({...system, language: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                    <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Date Format</Label>
                  <select aria-label="Select option" title="Select option" value={system.dateFormat} onChange={e => setSystem({...system, dateFormat: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveSystem} className="gap-2"><Save className="h-4 w-4" />Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
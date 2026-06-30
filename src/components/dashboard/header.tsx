"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>({ firstName: "User" });
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    const a = localStorage.getItem("avatar");
    if (a) setAvatar(a);

    const handleStorage = () => {
      const saved = localStorage.getItem("avatar");
      if (saved) setAvatar(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <h2 className="text-lg font-semibold">Welcome, {user?.firstName || "User"}</h2>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="h-8 w-8">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user?.firstName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => { localStorage.clear(); router.push("/login"); }}>
            <LogOut className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
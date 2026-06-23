"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth, useSupabase, logoutGuest } from "@/lib/supabase-store";
import { getLikesForMyOCs } from "@/lib/supabase-queries";
import { Search, MessageCircle, Plus, LogOut, User, Heart } from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (user && !("is_guest" in user && user.is_guest)) {
      getLikesForMyOCs().then((likes) => setLikeCount(likes.length)).catch(() => {});
    }
  }, [user]);

  async function handleLogout() {
    if (user && "is_guest" in user && user.is_guest) {
      logoutGuest();
    } else {
      await supabase.auth.signOut();
    }
    router.push("/auth/login");
  }

  const displayName = user
    ? "is_guest" in user
      ? user.user_metadata.display_name
      : user.email
    : "";

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/icon.avif" alt="Unhinged" className="h-11 w-11 rounded-md" />
          <span className="hidden sm:inline text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            UNHINGED
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 hover:text-primary hover:bg-primary/10" render={<Link href="/matches" />}>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Find Matches</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 hover:text-pink-400 hover:bg-pink-500/10 relative" render={<Link href="/likes" />}>
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Likes</span>
            {likeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1">
                {likeCount > 99 ? "99+" : likeCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 hover:text-primary hover:bg-primary/10" render={<Link href="/chat" />}>
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </Button>
          <Button variant="default" size="sm" className="gap-1.5 ml-2 bg-primary hover:bg-primary/90 text-white glow-pink-sm" render={<Link href="/create" />}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New OC</span>
          </Button>

          {user && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground hidden md:block max-w-[120px] truncate">
                {displayName}
              </span>
              {!("is_guest" in user && user.is_guest) && (
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" render={<Link href="/creator" />} aria-label="Creator profile">
                  <User className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={handleLogout} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

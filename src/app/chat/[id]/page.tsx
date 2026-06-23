"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BadgeSelector } from "@/components/badge/BadgeSelector";
import { useAuth, useSupabase } from "@/lib/supabase-store";
import { fetchMyOCs } from "@/lib/supabase-queries";
import type { OC } from "@/lib/types";
import { ArrowLeft, Send, ShieldCheck, Loader2, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { ChatMessage } from "@/lib/types";

const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆",
  "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗",
  "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐",
  "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌",
  "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
  "🤮", "🥴", "😵", "🤯", "🤠", "🥳", "🥺", "😢",
  "😭", "😤", "😡", "🤬", "😈", "👿", "💀", "☠️",
  "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
  "💔", "💕", "💞", "💗", "💖", "✨", "🔥", "⭐",
  "👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌",
  "🤲", "🤝", "🙏", "✌️", "🤟", "🤘", "👌", "✅",
];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [myOCs, setMyOCs] = useState<OC[]>([]);

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }

    fetchMyOCs().then(setMyOCs);

    supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", id)
      .single()
      .then(async ({ data: s }: any) => {
        if (!s) { setLoading(false); return; }

        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("chat_id", id)
          .order("created_at", { ascending: true });

        setSession(s);
        setMessages(
          (msgs || []).map((m: any) => ({
            id: m.id,
            fromOCId: m.from_oc_id,
            text: m.text,
            imageUrl: m.image_url,
            createdAt: new Date(m.created_at),
          }))
        );
        setLoading(false);
      });
  }, [id, user, router]);

  const myOCId = myOCs.find((o) => o.id === session?.oc1_id || o.id === session?.oc2_id)?.id || session?.oc1_id;
  const myOcName = myOCs.find((o) => o.id === myOCId)?.name || "Me";
  const otherOCId = session ? (myOCId === session.oc1_id ? session.oc2_id : session.oc1_id) : null;
  const otherOcName = (() => {
    if (!myOCId || !session) return "Them";
    return myOCId === session.oc1_id ? session.oc2_name : session.oc1_id;
  })();

  function insertEmoji(emoji: string) {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || !session || !user) return;

    const msg = {
      chat_id: session.id,
      from_oc_id: myOCId,
      text: input.trim(),
    };

    const { data, error } = await supabase.from("chat_messages").insert(msg).select().single();
    if (error) { toast.error("Failed to send"); return; }

    setMessages((prev) => [
      ...prev,
      { id: data.id, fromOCId: data.from_oc_id, text: data.text, createdAt: new Date(data.created_at) },
    ]);
    setInput("");
  }

  async function handleBadgeAward(icon: string, name: string) {
    if (!session || !user) return;
    const { error } = await supabase.from("oc_badges").insert({
      oc_id: session.oc2_id,
      name,
      icon,
      from_user_id: user.id,
      from_oc_id: session.oc1_id,
      from_oc_name: "Me",
    });
    if (error) { toast.error("Failed to award badge"); return; }
    toast.success(`Badge "${name}" awarded!`);
    setShowBadgeSelector(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <DashboardHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-2">Chat not found</h1>
          <p className="text-muted-foreground mb-6">This conversation doesn't exist.</p>
          <Button render={<Link href="/chat" />}>Back to Chats</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto flex max-w-3xl flex-col px-4 py-8">
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chats
        </Link>

        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium truncate">
                {myOcName} <span className="text-muted-foreground">↔</span> {otherOcName}
              </p>
              <span className="text-xs text-muted-foreground">
                #{id.slice(0, 8)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0 ml-3"
              onClick={() => setShowBadgeSelector(!showBadgeSelector)}
            >
              <ShieldCheck className="h-4 w-4" /> Award Badge
            </Button>
          </div>
        </Card>

        {showBadgeSelector && (
          <Card className="p-4 mb-4">
            <BadgeSelector onSelect={handleBadgeAward} />
          </Card>
        )}

        <div className="flex-1 space-y-3 mb-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {messages.map((msg) => {
            const isMine = msg.fromOCId === myOCId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-accent text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative">
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-2 left-0 right-0 z-30"
              >
                <Card className="p-3 max-h-[200px] overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded-md transition-colors active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`shrink-0 ${showEmojiPicker ? "text-accent bg-accent/10" : "text-muted-foreground"}`}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

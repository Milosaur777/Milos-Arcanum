"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMyChats, fetchMyOCs, deleteChat } from "@/lib/supabase-queries";
import type { ChatSession, OC } from "@/lib/types";
import { ArrowLeft, MessageCircle, Loader2, Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [myOCs, setMyOCs] = useState<OC[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ChatSession | null>(null);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    Promise.all([fetchMyChats(), fetchMyOCs()]).then(([c, o]) => {
      setChats(c);
      setMyOCs(o);
      setLoading(false);
    });
  }, []);

  function getMyOcName(session: ChatSession): string {
    const myOc = myOCs.find((o) => o.id === session.oc1Id || o.id === session.oc2Id);
    return myOc?.name || "Unknown OC";
  }

  function getOtherOcName(session: ChatSession): string {
    const myOcId = myOCs.find((o) => o.id === session.oc1Id || o.id === session.oc2Id)?.id;
    if (myOcId === session.oc1Id) return session.oc2Name;
    return session.oc1Id;
  }

  function confirmDelete(session: ChatSession, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget(session);
    setDeleteInput("");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const name = getOtherOcName(deleteTarget).toLowerCase();
    if (deleteInput.trim().toLowerCase() !== name) return;
    try {
      await deleteChat(deleteTarget.id);
      setChats((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteInput("");
      toast.success("Chat deleted");
    } catch (e: any) {
      toast.error(`Failed to delete: ${e?.message || e}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight mb-6">Chats</h1>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-medium mb-2">No conversations yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Find a match and start a chat to begin your first session.
            </p>
            <Button className="mt-4" render={<Link href="/matches" />}>Find Matches</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((session) => (
              <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Link href={`/chat/${session.id}`}>
                  <Card className="p-4 transition-all duration-200 hover:border-accent/50 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {getMyOcName(session)} <span className="text-muted-foreground">↔</span> {getOtherOcName(session)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          #{session.id.slice(0, 8)} · {session.messages.length} message{session.messages.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        <span
                          onClick={(e) => confirmDelete(session, e)}
                          className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </span>
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => { setDeleteTarget(null); setDeleteInput(""); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 text-destructive mb-3">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Delete this chat?</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  This will remove the conversation with
                </p>
                <p className="text-sm font-medium text-foreground mb-3">
                  {getOtherOcName(deleteTarget)}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Type <span className="font-mono font-bold text-foreground">{getOtherOcName(deleteTarget)}</span> to confirm
                </p>
                <Input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && deleteInput.trim().toLowerCase() === getOtherOcName(deleteTarget).toLowerCase()) handleDelete(); }}
                  placeholder={getOtherOcName(deleteTarget)}
                  className="h-9 text-center mb-4"
                  autoFocus
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDeleteTarget(null); setDeleteInput(""); }}
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteInput.trim().toLowerCase() !== getOtherOcName(deleteTarget).toLowerCase()}
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

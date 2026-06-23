import { createClient } from "@/lib/supabase";
import type { OC, OCField, OpenFeedEntry, Badge, ChatSession, ChatMessage } from "@/lib/types";

const GUEST_OCS_KEY = "unhinged_guest_ocs";

function isGuestUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("unhinged_guest") !== null;
}

function getGuestOCs(): OC[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(GUEST_OCS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((oc: any) => ({
      ...oc,
      createdAt: new Date(oc.createdAt),
      updatedAt: new Date(oc.updatedAt),
    }));
  } catch {
    return [];
  }
}

function saveGuestOCs(ocs: OC[]) {
  localStorage.setItem(GUEST_OCS_KEY, JSON.stringify(ocs));
}

// ─── OCs ───

export async function fetchMyOCs(): Promise<OC[]> {
  if (isGuestUser()) return getGuestOCs();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: ocs, error } = await supabase
    .from("ocs")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (ocs || []).map(mapOCFromDB);
}

export async function fetchPublicOCs(): Promise<OC[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("ocs")
    .select("*")
    .order("created_at", { ascending: false });

  if (user) {
    query = query.neq("user_id", user.id);
  }

  const { data: ocs, error } = await query;
  if (error) throw error;
  return (ocs || []).map(mapOCFromDB);
}

export async function fetchOCById(id: string): Promise<OC | null> {
  if (isGuestUser()) {
    const ocs = getGuestOCs();
    return ocs.find((o) => o.id === id) || null;
  }
  const supabase = createClient();
  const { data, error } = await supabase.from("ocs").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;

  const { data: fieldRows } = await supabase
    .from("oc_fields")
    .select("*")
    .eq("oc_id", id)
    .order("sort_order");

  const { data: feedRows } = await supabase
    .from("oc_open_feed")
    .select("*")
    .eq("oc_id", id)
    .order("created_at");

  const oc = mapOCFromDB(data);
  oc.fields = (fieldRows || []).map((r: any) => ({
    id: r.field_key,
    label: r.label,
    type: r.field_type,
    value: r.value,
    visible: r.visible,
    skipped: r.skipped,
  }));
  oc.openFeed = (feedRows || []).map((r: any) => ({
    id: r.id,
    content: r.content,
    visible: r.visible,
    createdAt: new Date(r.created_at),
  }));
  return oc;
}

export async function saveOC(oc: OC): Promise<OC> {
  if (isGuestUser()) {
    const ocs = getGuestOCs();
    const idx = ocs.findIndex((o) => o.id === oc.id);
    if (idx >= 0) {
      ocs[idx] = { ...oc, updatedAt: new Date() };
    } else {
      ocs.unshift({ ...oc, createdAt: new Date(), updatedAt: new Date() });
    }
    saveGuestOCs(ocs);
    return oc;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isNew = oc.id.startsWith("temp_");
  const dbRow: Record<string, any> = {
    name: oc.name,
    tags: oc.tags,
    truths_and_lie: oc.truthsAndLie,
    brand: oc.brand,
    is_premade: oc.isPreMade,
    image_url: oc.imageUrl || null,
    images: oc.images || [],
    updated_at: new Date().toISOString(),
  };
  if (isNew) {
    if (user) dbRow.user_id = user.id;
    dbRow.created_at = new Date().toISOString();
  } else {
    dbRow.id = oc.id;
    if (user) dbRow.user_id = user.id;
  }

  const { data, error } = await supabase.from("ocs").upsert(dbRow).select().single();
  if (error) {
    console.error("OC upsert error:", JSON.stringify(error));
    throw error;
  }
  const savedOcId = data.id;

  // Save fields
  const fieldRows = oc.fields.map((f, i) => ({
    oc_id: savedOcId,
    field_key: f.id,
    label: f.label,
    field_type: f.type,
    value: typeof f.value === "string" ? f.value : f.value.join(", "),
    visible: f.visible,
    skipped: f.skipped,
    sort_order: i,
  }));

  const { error: delFieldsErr } = await supabase.from("oc_fields").delete().eq("oc_id", savedOcId);
  if (delFieldsErr) console.error("Delete fields error:", delFieldsErr);

  if (fieldRows.length > 0) {
    const { error: insFieldsErr } = await supabase.from("oc_fields").insert(fieldRows);
    if (insFieldsErr) console.error("Insert fields error:", insFieldsErr);
  }

  // Save open feed
  const feedRows = oc.openFeed.map((e) => ({
    oc_id: savedOcId,
    content: e.content,
    visible: e.visible,
    created_at: e.createdAt.toISOString(),
  }));

  const { error: delFeedErr } = await supabase.from("oc_open_feed").delete().eq("oc_id", savedOcId);
  if (delFeedErr) console.error("Delete feed error:", delFeedErr);

  if (feedRows.length > 0) {
    const { error: insFeedErr } = await supabase.from("oc_open_feed").insert(feedRows);
    if (insFeedErr) console.error("Insert feed error:", insFeedErr);
  }

  return mapOCFromDB(data);
}

export async function deleteOC(id: string): Promise<void> {
  if (isGuestUser()) {
    const ocs = getGuestOCs().filter((o) => o.id !== id);
    saveGuestOCs(ocs);
    return;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("ocs").delete().eq("id", id).eq("user_id", user.id);
}

export async function reorderOCs(orderedIds: string[]): Promise<void> {
  if (isGuestUser()) {
    const ocs = getGuestOCs();
    const reordered = orderedIds
      .map((id, i) => {
        const oc = ocs.find((o) => o.id === id);
        return oc ? { ...oc, updatedAt: new Date() } : null;
      })
      .filter(Boolean) as OC[];
    saveGuestOCs(reordered);
    return;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const updates = orderedIds.map((id, i) =>
    supabase.from("ocs").update({ sort_order: i, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id)
  );
  await Promise.all(updates);
}

// ─── Image Upload ───

export async function uploadOCImage(file: File, ocId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${ocId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("oc-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("oc-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteOCImage(imageUrl: string): Promise<void> {
  const supabase = createClient();
  const url = new URL(imageUrl);
  const path = url.pathname.split("/object/oc-images/")[1];
  if (path) {
    await supabase.storage.from("oc-images").remove([path]);
  }
}

// ─── Matchmaking ───

export async function fetchMatchPreferences() {
  const supabase = createClient();
  const { data } = await supabase.from("match_preferences").select("*");
  return data || [];
}

// ─── Creator Profile ───

export interface CreatorProfile {
  id: string;
  displayName: string;
  creatorName: string;
  creatorBio: string;
  creatorAvatarUrl: string;
  creatorWebsite: string;
  creatorDiscord: string;
  creatorVisible: boolean;
}

export async function fetchCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    displayName: data.display_name || "",
    creatorName: data.creator_name || data.display_name || "",
    creatorBio: data.creator_bio || "",
    creatorAvatarUrl: data.creator_avatar_url || "",
    creatorWebsite: data.creator_website || "",
    creatorDiscord: data.creator_discord || "",
    creatorVisible: data.creator_visible ?? true,
  };
}

export async function updateCreatorProfile(profile: Partial<CreatorProfile>): Promise<void> {
  const supabase = createClient();
  const updates: Record<string, any> = {};
  if (profile.creatorName !== undefined) updates.creator_name = profile.creatorName;
  if (profile.creatorBio !== undefined) updates.creator_bio = profile.creatorBio;
  if (profile.creatorAvatarUrl !== undefined) updates.creator_avatar_url = profile.creatorAvatarUrl;
  if (profile.creatorWebsite !== undefined) updates.creator_website = profile.creatorWebsite;
  if (profile.creatorDiscord !== undefined) updates.creator_discord = profile.creatorDiscord;
  if (profile.creatorVisible !== undefined) updates.creator_visible = profile.creatorVisible;
  if (profile.displayName !== undefined) updates.display_name = profile.displayName;

  const { error } = await supabase.from("profiles").upsert(updates, { onConflict: "id" });
  if (error) throw error;
}

// ─── Chat ───

export async function fetchMyChats(): Promise<ChatSession[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: myOcs } = await supabase
    .from("ocs")
    .select("id")
    .eq("user_id", user.id);

  const myOcIds = new Set((myOcs || []).map((o: any) => o.id));

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (!sessions) return [];
  const filtered = sessions.filter((s: any) => myOcIds.has(s.oc1_id) || myOcIds.has(s.oc2_id));

  return Promise.all(
    filtered.map(async (s: any) => {
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", s.id)
        .order("created_at", { ascending: true });

      return {
        id: s.id,
        oc1Id: s.oc1_id,
        oc2Id: s.oc2_id,
        oc2UserId: s.oc2_user_id,
        oc2UserName: s.oc2_user_name,
        oc2Name: s.oc2_name,
        imagesAllowed: s.images_allowed,
        messages: (messages || []).map((m: any) => ({
          id: m.id,
          fromOCId: m.from_oc_id,
          text: m.text,
          imageUrl: m.image_url,
          createdAt: new Date(m.created_at),
        })),
        createdAt: new Date(s.created_at),
      } as ChatSession;
    })
  );
}

export async function createChatSession(oc1Id: string, oc2Id: string, oc2Name: string): Promise<string | null> {
  const supabase = createClient();
  const { data: oc2 } = await supabase.from("ocs").select("user_id").eq("id", oc2Id).maybeSingle();
  if (!oc2) return null;

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", oc2.user_id).maybeSingle();

  const { data, error } = await supabase
    .from("chat_sessions")
    .upsert({
      oc1_id: oc1Id,
      oc2_id: oc2Id,
      oc2_user_id: oc2.user_id,
      oc2_user_name: profile?.display_name || "Unknown",
      oc2_name: oc2Name,
    }, { onConflict: "oc1_id,oc2_id" })
    .select("id")
    .maybeSingle();

  if (error) throw error;
  return data?.id || null;
}

export async function deleteChat(chatId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("chat_sessions").delete().eq("id", chatId);
  if (error) throw error;
}

// ─── Swipe / Likes ───

export async function recordSwipe(fromOcId: string, toOcId: string, action: "like" | "pass"): Promise<void> {
  if (isGuestUser()) return;
  const supabase = createClient();
  const { error } = await supabase
    .from("swipe_actions")
    .upsert({ from_oc_id: fromOcId, to_oc_id: toOcId, action }, { onConflict: "from_oc_id,to_oc_id" });
  if (error) { console.error("recordSwipe error:", error); throw error; }
}

export async function undoLastSwipe(fromOcId: string): Promise<void> {
  if (isGuestUser()) return;
  const supabase = createClient();
  const { data } = await supabase
    .from("swipe_actions")
    .select("id")
    .eq("from_oc_id", fromOcId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (data?.[0]) {
    await supabase.from("swipe_actions").delete().eq("id", data[0].id);
  }
}

export async function checkMutualLike(oc1Id: string, oc2Id: string): Promise<boolean> {
  if (isGuestUser()) return false;
  const supabase = createClient();
  const { data } = await supabase
    .from("swipe_actions")
    .select("id")
    .eq("from_oc_id", oc2Id)
    .eq("to_oc_id", oc1Id)
    .eq("action", "like")
    .maybeSingle();
  return !!data;
}

export interface SwipeLike {
  ocId: string;
  toOcId: string;
  ocName: string;
  ocImageUrl?: string;
  ocTags: string[];
  createdAt: Date;
}

export async function getLikesForMyOCs(): Promise<SwipeLike[]> {
  if (isGuestUser()) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const myOcs = await fetchMyOCs();
  const myOcIds = myOcs.map((o) => o.id);
  if (myOcIds.length === 0) return [];

  const { data: likes, error } = await supabase
    .from("swipe_actions")
    .select("from_oc_id, to_oc_id, created_at")
    .in("to_oc_id", myOcIds)
    .eq("action", "like")
    .order("created_at", { ascending: false });

  if (error || !likes) return [];

  // Don't show likes we've already responded to (liked back or passed)
  const { data: myActions } = await supabase
    .from("swipe_actions")
    .select("from_oc_id, to_oc_id")
    .in("from_oc_id", myOcIds);

  const responded = new Set(
    (myActions || []).map((r: any) => `${r.to_oc_id}_${r.from_oc_id}`)
  );

  const filtered = likes.filter(
    (l: any) => !responded.has(`${l.from_oc_id}_${l.to_oc_id}`)
  );

  const ocIds = filtered.map((l: any) => l.from_oc_id);
  const { data: ocs } = await supabase
    .from("ocs")
    .select("id, name, image_url, tags")
    .in("id", ocIds);

  const ocMap = new Map((ocs || []).map((o: any) => [o.id, o]));

  return filtered.map((l: any) => {
    const oc = ocMap.get(l.from_oc_id);
    return {
      ocId: l.from_oc_id,
      toOcId: l.to_oc_id,
      ocName: oc?.name || "Unknown",
      ocImageUrl: oc?.image_url || undefined,
      ocTags: oc?.tags || [],
      createdAt: new Date(l.created_at),
    };
  });
}

export async function blockOC(blockerId: string, blockedId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("blocked_pairs").upsert({ blocker_oc_id: blockerId, blocked_oc_id: blockedId });
}

export async function unblockOC(blockerId: string, blockedId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("blocked_pairs").delete()
    .eq("blocker_oc_id", blockerId)
    .eq("blocked_oc_id", blockedId);
}

export async function getBlockedOcIds(): Promise<Set<string>> {
  if (isGuestUser()) return new Set();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data: myOcs } = await supabase
    .from("ocs")
    .select("id")
    .eq("user_id", user.id);

  if (!myOcs || myOcs.length === 0) return new Set();

  const myOcIds = myOcs.map((o: any) => o.id);

  const { data } = await supabase
    .from("blocked_pairs")
    .select("blocked_oc_id")
    .in("blocker_oc_id", myOcIds);

  return new Set((data || []).map((r: any) => r.blocked_oc_id));
}

export async function getSwipedOcIds(ocId: string): Promise<Set<string>> {
  if (isGuestUser()) return new Set();
  const supabase = createClient();
  const { data } = await supabase
    .from("swipe_actions")
    .select("to_oc_id")
    .eq("from_oc_id", ocId);

  return new Set((data || []).map((r: any) => r.to_oc_id));
}

// ─── DB Mapping ───

function mapOCFromDB(data: any): OC {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    fields: [],
    tags: data.tags || [],
    truthsAndLie: (data.truths_and_lie as [string, string, string]) || ["", "", ""],
    openFeed: [],
    brand: data.brand || 0,
    badges: [],
    visibleBadgeIds: [],
    isPreMade: data.is_premade || false,
    imageUrl: data.image_url || undefined,
    images: data.images || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

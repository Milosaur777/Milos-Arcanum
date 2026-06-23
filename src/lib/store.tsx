"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { OC, Badge, ChatSession, MatchPreference, OpenFeedEntry } from "@/lib/types";

interface OCState {
  ocs: OC[];
  matchPreferences: MatchPreference[];
  chatSessions: ChatSession[];
  nextOCId: number;
}

type OCAction =
  | { type: "ADD_OC"; oc: OC }
  | { type: "UPDATE_OC"; oc: OC }
  | { type: "DELETE_OC"; id: string }
  | { type: "ADD_BRAND"; ocId: string; amount: number }
  | { type: "ADD_BADGE"; ocId: string; badge: Badge }
  | { type: "SET_VISIBLE_BADGES"; ocId: string; badgeIds: string[] }
  | { type: "ADD_CHAT"; session: ChatSession }
  | { type: "ADD_MESSAGE"; chatId: string; message: ChatSession["messages"][0] }
  | { type: "SET_MATCH_PREFERENCES"; preferences: MatchPreference[] }
  | { type: "LOAD"; state: OCState };

function ocReducer(state: OCState, action: OCAction): OCState {
  switch (action.type) {
    case "ADD_OC":
      return { ...state, ocs: [...state.ocs, action.oc], nextOCId: state.nextOCId + 1 };
    case "UPDATE_OC":
      return { ...state, ocs: state.ocs.map((o) => (o.id === action.oc.id ? action.oc : o)) };
    case "DELETE_OC":
      return { ...state, ocs: state.ocs.filter((o) => o.id !== action.id) };
    case "ADD_BRAND":
      return {
        ...state,
        ocs: state.ocs.map((o) =>
          o.id === action.ocId ? { ...o, brand: o.brand + action.amount } : o
        ),
      };
    case "ADD_BADGE":
      return {
        ...state,
        ocs: state.ocs.map((o) =>
          o.id === action.ocId ? { ...o, badges: [...o.badges, action.badge] } : o
        ),
      };
    case "SET_VISIBLE_BADGES":
      return {
        ...state,
        ocs: state.ocs.map((o) =>
          o.id === action.ocId ? { ...o, visibleBadgeIds: action.badgeIds } : o
        ),
      };
    case "ADD_CHAT":
      return { ...state, chatSessions: [...state.chatSessions, action.session] };
    case "ADD_MESSAGE":
      return {
        ...state,
        chatSessions: state.chatSessions.map((c) =>
          c.id === action.chatId
            ? { ...c, messages: [...c.messages, action.message] }
            : c
        ),
      };
    case "SET_MATCH_PREFERENCES":
      return { ...state, matchPreferences: action.preferences };
    case "LOAD":
      return action.state;
    default:
      return state;
  }
}

const initialState: OCState = {
  ocs: [],
  matchPreferences: [],
  chatSessions: [],
  nextOCId: 1,
};

const OCContext = createContext<{
  state: OCState;
  dispatch: React.Dispatch<OCAction>;
} | null>(null);

export function OCProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ocReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("oc-dating-store");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD", state: parsed });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("oc-dating-store", JSON.stringify(state));
  }, [state]);

  return <OCContext.Provider value={{ state, dispatch }}>{children}</OCContext.Provider>;
}

export function useOCStore() {
  const ctx = useContext(OCContext);
  if (!ctx) throw new Error("useOCStore must be used within OCProvider");
  return ctx;
}

export function generateOCId(next: number): string {
  return `oc_${next}_${Date.now()}`;
}

export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

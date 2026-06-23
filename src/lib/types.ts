export interface OCField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "tags";
  value: string | string[];
  visible: boolean;
  skipped: boolean;
}

export interface OpenFeedEntry {
  id: string;
  content: string;
  visible: boolean;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  fromUserId: string;
  fromOCId: string;
  fromOCName: string;
  message?: string;
  createdAt: Date;
}

export interface OC {
  id: string;
  userId?: string;
  name: string;
  fields: OCField[];
  tags: string[];
  truthsAndLie: [string, string, string];
  openFeed: OpenFeedEntry[];
  brand: number;
  badges: Badge[];
  visibleBadgeIds: string[];
  isPreMade: boolean;
  imageUrl?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchPreference {
  ocId: string;
  seekingTags: string[];
}

export interface MatchedOC {
  oc: OC;
  userId: string;
  userName: string;
  score: number;
  matchedTags: string[];
}

export interface ChatMessage {
  id: string;
  fromOCId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  oc1Id: string;
  oc2Id: string;
  oc2UserId: string;
  oc2UserName: string;
  oc2Name: string;
  imagesAllowed: boolean;
  messages: ChatMessage[];
  createdAt: Date;
  scene?: Scene;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
}

export const PREMADE_CHARACTERS: Array<{ name: string; description: string; tags: string[] }> = [
  { name: "Mysterious Knight", description: "A battle-hardened warrior with a hidden past", tags: ["fantasy", "warrior", "knight", "human"] },
  { name: "Star Wanderer", description: "An explorer from beyond the stars", tags: ["sci-fi", "explorer", "alien", "space"] },
  { name: "Shadow Stalker", description: "A creature of the night that moves between shadows", tags: ["horror", "shadow", "monster", "dark"] },
  { name: "Forest Spirit", description: "An ancient being that protects the natural world", tags: ["fantasy", "spirit", "nature", "elf"] },
  { name: "Urban Detective", description: "A gritty investigator in a rain-soaked city", tags: ["noir", "detective", "human", "crime"] },
];

export const SCENES: Scene[] = [
  { id: "beach", name: "Beach", description: "A sunny shoreline with gentle waves" },
  { id: "tavern", name: "Tavern", description: "A cozy inn with a crackling fireplace" },
  { id: "cave", name: "Cave", description: "A dark, echoing cavern deep underground" },
  { id: "forest", name: "Enchanted Forest", description: "A mystical woodland with glowing flora" },
  { id: "castle", name: "Castle", description: "A grand medieval hall with tall stone arches" },
  { id: "space", name: "Space Station", description: "A futuristic station orbiting a distant planet" },
  { id: "city", name: "Rainy City", description: "Neon-lit streets under a perpetual downpour" },
  { id: "garden", name: "Moonlit Garden", description: "A serene garden bathed in silver light" },
];

export const BADGE_TEMPLATES = [
  { name: "Funny", icon: "😄" },
  { name: "In Character", icon: "🎭" },
  { name: "Great Roleplayer", icon: "🏆" },
  { name: "Creative", icon: "✨" },
  { name: "Romantic", icon: "🌹" },
  { name: "Mysterious", icon: "🔮" },
  { name: "Adventurous", icon: "⚔️" },
  { name: "Storyteller", icon: "📖" },
];

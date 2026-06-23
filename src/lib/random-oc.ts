function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Names ───

const FIRST_NAMES = [
  "Lyra", "Kael", "Zephyr", "Nyx", "Orion", "Sable", "Ember", "Vex",
  "Astra", "Blaze", "Clover", "Dusk", "Echo", "Frost", "Grim", "Haze",
  "Ivy", "Jinx", "Koda", "Luna", "Maverick", "Nova", "Onyx", "Pixel",
  "Quinn", "Raven", "Sage", "Thorn", "Umbra", "Vale", "Wren", "Xara",
  "Yuki", "Zara", "Ash", "Briar", "Caspian", "Dahlia", "Elm", "Fern",
  "Glitch", "Helix", "Indra", "Jade", "Kai", "Lark", "Moth", "Nero",
  "Opal", "Pip", "Rune", "Shade", "Talon", "Vesper", "Wolf", "Zinc",
  "Aria", "Bane", "Cinder", "Draven", "Eve", "Flint", "Gale", "Hex",
  "Iris", "Jett", "Kit", "Lynx", "Moss", "Neo", "Omen", "Pulse",
  "Reverie", "Sylph", "Thane", "Ursa", "Valko", "Wraith", "Xenon", "Yara",
  "Zenith", "Artemis", "Blitz", "Coral", "Dagger", "Eclipse", "Fang", "Garnet",
  "Harbor", "Icicle", "Jasper", "Karma", "Lilith", "Mace", "Nebula", "Oracle",
  "Phantom", "Raven", "Scar", "Tempest", "Unity", "Viper", "Wynter", "Axel",
  "Basil", "Clove", "Dusk", "Ember", "Fable", "Glen", "Haven", "Ivy",
  "Julep", "Kestrel", "Lumen", "Myrrh", "Nix", "Oak", "Pebble", "Quill",
];

const LAST_NAMES = [
  "Shadowveil", "Ironheart", "Stormborn", "Nightwhisper", "Firebrand",
  "Duskwalker", "Thornwood", "Moonshadow", "Steelwind", "Ashborne",
  "Voidseeker", "Brightforge", "Darkhollow", "Starfall", "Frostborne",
  "Embercrown", "Silverhand", "Blackthorn", "Windrider", "Bloodmoon",
  "Soulforge", "Dreadwolf", "Lightbane", "Ravencrest", "Goldvein",
  "Ghostfire", "Bonechill", "Dawnbreaker", "Nightvane", "Wraithwood",
  "Hexborne", "Dustwalker", "Shardwind", "Gloomvale", "Cindermask",
  "Plagueborn", "Riftwalker", "Skycleaver", "Tidecaster", "Wormwood",
  "Ashveil", "Blacksun", "Crestfall", "Doomsayer", "Evernight",
  "Flamecrest", "Gravewind", "Hellborn", "Icevein", "Jadefire",
  "Nightbloom", "Steelgaze", "Voidmark", "Wolfsbane", "Zephyrheart",
  "Brightmantle", "Darkhollow", "Emberthorn", "Frostwhisper", "Gloomstalker",
  "Hollowbane", "Ironveil", "Jadeclaw", "Kingsbane", "Lunaheart",
  "Mistwalker", "Netherblaze", "Obsidian", "Phantomsong", "Quickshadow",
  "Ravenbane", "Shadowmend", "Twilight", "Undertow", "Venomsong",
  "Wyrmwood", "Xenoweave", "Yieldthorn", "Zenithblaze", "Ashmark",
  "Bonechaser", "Crestwalker", "Duskrend", "Eclipseborn", "Fangmark",
];

const SPECIES = [
  "Human", "Elf", "Dwarf", "Orc", "Dragon", "Demon", "Angel", "Vampire",
  "Werewolf", "Fairy", "Mermaid", "Centaur", "Ghost", "Zombie", "Robot",
  "Android", "Alien", "Hybrid", "Shapeshifter", "Necromancer",
  "Tiefling", "Dragonborn", "Halfling", "Gnome", "Triton", "Aasimar",
  "Lizardfolk", "Tabaxi", "Kenku", "Firbolg", "Goliath", "Hobgoblin",
  "Goblin", "Kobold", "Minotaur", "Ogre", "Satyr", "Harpy", "Siren",
  "Changeling", "Warforged", "Bugbear", "Eladrin", "Shadar-kai",
  "Autognome", "Plasmoid", "Thri-kreen", "Hadozee", "Githyanki",
  "Mech", "Construct", "Elemental", "Fungus", "Mushroom Person",
  "Living Statue", "Sentient Crystal", "Starborn", "Voidtouched",
  "Dreamweaver", "Timewalker", "Soulless", "Reborn", "Hexblood",
  "Merkith", "Scaleborn", "Thornkin", "Wisp", "Cloud Giant",
  "Fire Giant", "Frost Giant", "Stone Giant", "Storm Giant", "Hag",
  "Banshee", "Wight", "Wraith", "Specter", "Lich",
  "Beholder", "Mind Flayer", "Githzerai", "Kuo-toa", "Yuan-ti",
  "Aarakocra", "Bullywug", "Gnoll", "Hippogriff", "Griffon",
  "Pegasus", "Unicorn", "Kirin", "Phoenix", "Roc",
];

const GENDERS = ["Male", "Female", "Non-binary", "Genderfluid", "Agender", "Shapeshifting", "None", "Other"];
const ORIENTATIONS = ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Demisexual", "Queer", "Fluid", "Other"];
const ROMANTIC_ORIENTATIONS = ["Heteroromantic", "Homoromantic", "Biromantic", "Panromantic", "Aromantic", "Demiromantic", "Polyromantic", "Greyromantic", "Other"];

const HAIR_STYLES = [
  "Long and flowing", "Short and spiky", "Buzz cut", "Braided", "Ponytail",
  "Messy bun", "Mohawk", "Cornrows", "Dreadlocks", "Pigtails",
  "Side-swept", "Undercut", "Wavy shoulder-length", "Curly and wild",
  "Slicked back", "Bald", "Pixie cut", "Twin tails", "Rapunzel-length",
  "Half-shaved", "Wild and untamed", "Neatly combed", "Pompadour",
  "Crown braid", "Fishtail braid", "Topknot", "Shaggy layers",
  "Asymmetrical bob", "Floor-length waves", "Tentacle-like", "Made of fire",
  "Living shadows", "Starlight-infused", "Crystalline", "Liquid mercury",
];

const HAIR_COLORS = [
  "Jet black", "Silver white", "Blood red", "Electric blue", "Emerald green",
  "Sunset orange", "Lavender purple", "Hot pink", "Golden blonde", "Icy platinum",
  "Rainbow", "Chrome", "Neon green", "Midnight blue", "Rose gold",
  "Copper", "Ash brown", "Strawberry blonde", "Teal", "Crimson",
  "Abyssal black", "Moonlit silver", "Inferno red", "Ocean turquoise",
  "Violet mist", "Obsidian", "Stardust", "Burning amber", "Phantom white",
  "Bioluminescent blue", "Living vines", "Frozen fractals", "Nebula purple",
];

const EYE_COLORS = [
  "Emerald green", "Sapphire blue", "Ruby red", "Amber gold", "Violet",
  "Silver", "Obsidian black", "Ice white", "Heterochromia (gold & blue)",
  "Heterochromia (red & green)", "Glowing cyan", "Glowing red",
  "Amethyst", "Topaz", "Obsidian with stars", "Mercury", "Rose pink",
  "Electric purple", "Seafoam", "Blood orange",
  "Molten lava", "Frozen冰", "Cosmic void", "Prismatic rainbow",
  "Shifting colors", "Pure white with black sclera", "Solid black with glowing iris",
  "Living flames", "Liquid silver", "Galaxy swirls", "Cracked with light",
];

const BODY_TYPES = [
  "Athletic", "Slim", "Muscular", "Curvy", "Stocky", "Tall and lean",
  "Petite", "Broad-shouldered", "Lanky", "Compact", "Imposing",
  "Delicate", "Powerful", "Willowy", "Sturdy", "Graceful",
  "Massive", "Scrawny", "Towering", "Dwarven", "Ethereal",
  "Shifting", "Amorphous", "Mechanical", "Crystalline",
];

const FEATURES = [
  "Facial scars", "Tattoos covering arms", "Horns protruding from forehead",
  "Pointed ears", "Fangs", "Claws", "Tail", "Wings (bat-like)",
  "Wings (angelic)", "Glowing markings on skin", "Heterochromia",
  "Third eye", "Cybernetic arm", "Clockwork eye", "Antlers",
  "Bioluminescent freckles", "Crystalline growths", "Venomous bite marks",
  "Runic tattoos", "Missing finger", "Prosthetic leg", "Burn scars",
  "Golden chain across face", "Piercings everywhere", "Hooded eyes",
  "Sharp canines", "Elaborate ear jewelry", "Face paint",
  "Mechanical jaw", "Ethereal glow", "Shadow-like aura",
  "Extra set of arms", "Tentacle hair", "Living tattoos that move",
  "Constantly shifting face", "Half-melted appearance", "Floating hands",
  "Invisible except in moonlight", "Flickers like a glitch", "Made of smoke",
  "Cracked porcelain skin", "Vines growing from skin", "Geometric patterns on skin",
  "One giant eye", "No mouth", "Translucent skin showing bones",
  "Constantly dripping ink", "Made of living books", "Musical notes float around them",
];

const PERSONALITIES = [
  "Brooding and mysterious", "Cheerful optimist", "Cold and calculating",
  "Hot-headed warrior", "Quiet intellectual", "Charming trickster",
  "Noble hero", "Cunning villain", "Eccentric inventor", "Stoic guardian",
  "Playful trickster", "Ruthless mercenary", "Compassionate healer",
  "Dark humor enthusiast", "Honorable knight", "Sneaky rogue",
  "Wise mentor", "Reckless adventurer", "Paranoid survivor",
  "Loyal companion", "Arrogant genius", "Shy bookworm",
  "Party animal", "Nature lover", "Technology obsessed",
  "Religious zealot", "Cynical realist", "Dreamy idealist",
  "Fierce loyalist", "Smooth talker", "Socially awkward",
  "Perfectionist", "Free spirit", "Control freak",
  "Drama queen", "Chaotic neutral", "Pathological liar with a heart of gold",
  "Would die for their friends", "Would kill for a snack",
  "Speaks only in questions", "Never stops laughing", "Cries at sunsets",
  "Obsessed with collecting bones", "Treats every fight like a performance",
  "Convinced they're a god", "Genuinely believes they're cursed",
  "Collects enemies like trading cards", "Refuses to kill but will absolutely destroy you psychologically",
];

const BACKSTORIES = [
  "Raised by wolves in the enchanted forest after being abandoned as a child",
  "Former royal guard who witnessed the king's assassination and fled",
  "Sold their soul to a demon in exchange for the power to save their village",
  "Woke up in a dungeon with no memory of who they are or how they got there",
  "Escaped from a gladiatorial arena where they fought for 10 years",
  "Was cursed by a witch to never die, watching everyone they love grow old",
  "Discovered they were created in a laboratory as a weapon",
  "Once ruled a vast kingdom that crumbled due to a terrible betrayal",
  "Trained as an assassin but defected after being ordered to kill an innocent",
  "Survived a plague that wiped out their entire civilization",
  "Born during a meteor shower, marked by the gods for a great destiny",
  "Was a celebrated hero until they accidentally destroyed a city",
  "Grew up on the streets, stealing to survive, now seeking redemption",
  "Former pirate captain who retired after a legendary treasure hunt",
  "Discovered magical abilities that are slowly killing them",
  "Was frozen in ice for centuries and woke up in a completely different world",
  "Betrayed by their best friend and left for dead in the wastelands",
  "Chosen by an ancient artifact that grants immense power at a terrible cost",
  "Raised in a monastery, trained in both martial arts and arcane magic",
  "Was a normal person until a freak accident fused their DNA with a dragon",
  "Witnessed the apocalypse and is one of the few survivors",
  "Escaped from a cult that worshipped an eldritch horror",
  "Was a famous musician until a mysterious illness stole their voice",
  "Grew up in a floating city that was destroyed by an ancient enemy",
  "Born as a twin but absorbed their sibling in the womb, carrying their ghost",
  "Former god who was stripped of divinity and cast down to the mortal realm",
  "Woke up one day and realized they could see how everyone would die",
  "Made a bet with Death and won — now they owe Death a favor",
  "Was the chosen one but the prophecy was about someone else entirely",
  "Spent 20 years building a time machine only to go back and prevent themselves from building it",
  "Stole a map to the afterlife and now every ghost wants it back",
  "Was raised by a dragon who believed they were also a dragon",
  "Accidentally merged two parallel universes and is the only one who remembers both",
  "Sold their memories one by one to pay off a debt, now has none left",
  "Was a judge in the underworld but quit because the paperwork was endless",
  "Trained for 1000 years to fight a great evil, then it turned out to be a misunderstanding",
  "Can taste the future but only when it involves soup",
  "Was cursed to only speak the truth but lies sound exactly like truth to them",
  "Grew up in a library that was also a sentient being",
  "Was born in two places at once and still exists in both",
];

const STRENGTHS = [
  "Swordsmanship", "Archery", "Magic", "Stealth", "Persuasion",
  "Intelligence", "Strength", "Speed", "Endurance", "Charisma",
  "Healing", "Engineering", "Animal handling", "Navigation", "Cooking",
  "Hacking", "Piloting", "Singing", "Intimidation", "Diplomacy",
  "Shape-shifting", "Telepathy", "Telekinesis", "Time manipulation",
  "Elemental control", "Necromancy", "Alchemy", "Enchantment",
  "Sword swallowing", "Gossip", "Parallel parking", "Making friends",
  "Holding grudges", "Dramatic exits", "Monologuing", "Survival",
  "Finding trouble", "Breaking things", "Talking their way out",
  "Talking their way into worse situations", "Making enemies",
];

const WEAKNESSES = [
  "Blind loyalty", "Arrogance", "Temper", "Paranoia", "Greed",
  "Cowardice", "Obsession", "Recklessness", "Stubbornness", "Naivety",
  "Addiction", "Guilt", "Fear of fire", "Claustrophobia", "Trust issues",
  "Perfectionism", "Self-doubt", "Vengeance", "Loneliness", "Impulsiveness",
  "Cannot lie", "Afraid of butterflies", "Compulsive hoarder",
  "Must touch every shiny object", "Cannot say no", "Easily distracted",
  "Allergic to magic", "Cowardice in daylight", "Cannot swim",
  "Needs 14 hours of sleep", "Emotional damage from past life",
  "Honest to a fault", "Overly trusting", "Fears their own power",
  "Cannot eat anything green", "Cries during fights", "Kleptomania",
  "Fatalistic worldview", "Allergic to cats",
];

const QUOTES = [
  "The darkness is not something to fear — it is something to become.",
  "I don't make promises. I make threats.",
  "Every scar tells a story. Mine write epics.",
  "Hope is a currency, and I'm bankrupt.",
  "I was made in fire. You can't burn what's already ash.",
  "Talk is cheap. My blade is not.",
  "I've seen the end of the world. It was disappointing.",
  "They told me to follow my heart. I cut it out instead.",
  "The only thing stronger than fear is spite.",
  "I don't need a reason. I need a target.",
  "You can't kill what's already dead inside.",
  "Some people pray for salvation. I pray for destruction.",
  "I was born in chaos. I thrive in it.",
  "Mercy is a luxury I was never afforded.",
  "The world broke me. Now I'm unbreakable.",
  "I don't fight fair. I fight to win.",
  "Every angel has fallen. Every demon was once innocent.",
  "I walk between worlds, belonging to neither.",
  "Power isn't given. It's taken.",
  "Silence is my weapon. Patience is my armor.",
  "I don't have an attitude problem. You have a perception problem.",
  "I'm not arguing. I'm simply explaining why I'm right.",
  "I'd agree with you, but then we'd both be wrong.",
  "My enemies call me a monster. My friends know I'm worse.",
  "I don't carry grudges. I carry consequences.",
  "The stars are just holes in the darkness. I am both.",
  "I've been to hell. The commute is terrible.",
  "I don't need a sword to destroy you.",
  "My heart is a graveyard and I dance among the tombstones.",
  "I was born with ice in my veins and fire in my soul.",
  "Some call it arrogance. I call it confidence.",
  "The world is a stage, and I burned down the theater.",
  "I don't make the rules. I break them.",
  "Pain is temporary. Glory is forever. Screams are temporary too.",
  "I've lost everything. That makes me dangerous.",
];

const SEEKING_TAGS = [
  "fantasy", "sci-fi", "horror", "romance", "action", "adventure",
  "mystery", "slice-of-life", "dark", "fluffy", "angst", "hurt/comfort",
  "enemies-to-lovers", "friends-to-lovers", "slow-burn", "forbidden love",
  "found family", "redemption", "revenge", "survival", "exploration",
  "political intrigue", "war", "heist", "rebellion", "prophecy",
  "magic system", "world-building", "character study", "plot-heavy",
  "detailed roleplay", "casual", "long-term", "one-shot",
  "dark comedy", "psychological thriller", "body horror", "cosmic horror",
  "mecha", "cyberpunk noir", "fairy tale retelling", "mythology",
  "time travel", "parallel universes", "eldritch", "divine",
  "monster of the week", "dungeon crawl", "political satire",
];

const TAGS_POOL = [
  "fantasy", "sci-fi", "horror", "noir", "cyberpunk", "steampunk",
  "post-apocalyptic", "magic", "dragons", "sword", "guns",
  "space", "pirates", "ninjas", "samurai", "knights", "wizards",
  "vampires", "werewolves", "demons", "angels", "gods",
  "dark", "fluffy", "angst", "romance", "action", "mystery",
  "adventure", "horror", "comedy", "drama", "tragedy",
  "enemies-to-lovers", "forbidden love", "slow-burn", "found family",
  "revenge", "redemption", "survival", "prophecy", "rebellion",
  "war", "heist", "intrigue", "betrayal", "time-travel",
  "cybernetic", "biomechanical", "organic", "ethereal", "shadow",
  "fire", "ice", "lightning", "earth", "water", "void",
  "ancient", "futuristic", "medieval", "modern", "alternate-reality",
  "eldritch", "lovecraftian", "mythological", "biblical", "fairy tale",
  "steampunk", "dieselpunk", "atompunk", "solarpunk", "biopunk",
  "mecha", "kaiju", "magical girl", "isekai", "cultivation",
  "xianxia", "wuxia", "silkpunk", "mythic", "epic",
  "slice of life", "school life", "workplace", "military", "maritime",
  "underground", "heavenly", "infernal", "astral", "liminal",
];

// ─── Truths & Lies ───

const TRUTH_TEMPLATES = [
  "I once killed a man with my bare hands in a tavern brawl.",
  "I can speak 14 languages, including three that are extinct.",
  "I have a pet dragon named Whispers who sleeps in my closet.",
  "I was raised by monks in a monastery on top of a floating island.",
  "I have a bounty on my head in seven different kingdoms.",
  "I once survived being lost in the Shadow Realm for three years.",
  "I'm secretly funding a rebellion against the empire.",
  "I can taste lies — they leave a metallic flavor on my tongue.",
  "I was born blind but gained sight through a magical transplant.",
  "I once ate an entire wedding cake in one sitting. No regrets.",
  "I have a mechanical heart that needs to be wound up every morning.",
  "I was crowned king of a nation and abdicated 24 hours later.",
  "I can communicate with the dead, but they're all terrible gossips.",
  "I once won a sword fight while completely unconscious.",
  "I have a scar from every person who ever tried to kill me.",
  "I was trained by the greatest assassin in history — my mother.",
  "I once sailed a ship through a hurricane using nothing but spite.",
  "I can read minds, but only when people are thinking about cheese.",
  "I was frozen in time for 500 years and woke up during a rave.",
  "I once convinced an entire army to surrender using only a spoon.",
  "I have a map of every secret passage in the castle tattooed on my back.",
  "I can transform into any animal, but I always come back as the wrong one.",
  "I was prophesied to destroy the world, so I'm trying to figure out how to un-do that.",
  "I once arm-wrestled a giant and won. My arm was never the same.",
  "I once picked a lock using only a fish bone and pure determination.",
  "I have a room in my house that doesn't exist on any blueprint.",
  "I once talked my way out of being sacrificed to a dark god.",
  "I can hear colors and see sounds — it's as confusing as it sounds.",
  "I was banished from three different dimensions for tax evasion.",
  "I have a blood pact with a tree. The tree is my oldest friend.",
  "I once won a cooking competition by accidentally poisoning the judges.",
  "I've been married four times. All four spouses were the same person.",
  "I once found a door in the ocean and walked through it.",
  "I have a collection of 200 cursed items. They're in a box. I don't open the box.",
  "I was born during an eclipse and I've never cast a shadow.",
  "I once fought a god to a draw. We agreed to never speak of it.",
  "I can taste colors and smell words. It makes reading very overwhelming.",
  "I once completed a quest that hadn't been assigned yet.",
  "I carry the last breath of every person I've ever killed.",
  "I once stole a god's lightning bolt and used it to toast bread.",
];

const LIE_TEMPLATES = [
  "I once defeated an entire army of 1,000 soldiers single-handedly.",
  "I can fly, but only backwards and only on Tuesdays.",
  "I'm secretly the heir to the throne of every kingdom on the continent.",
  "I have a magic sword that sings opera when you draw it.",
  "I once turned a dragon into a teapot using a spell I made up.",
  "I can stop time, but I have to hold my breath while doing it.",
  "I was born underwater and learned to breathe fire as a baby.",
  "I have a twin who is identical to me except they're 6 feet taller.",
  "I once walked on the sun and got a mild sunburn.",
  "I can talk to plants, and they all think I'm annoying.",
  "I once ate so much magic mushrooms that I accidentally ascended to godhood.",
  "I have a third arm that only appears when nobody is looking.",
  "I once raced a cheetah and won. The cheetah was on crutches.",
  "I can teleport, but I always end up in the wrong dimension.",
  "I was bitten by a radioactive wizard and now I cast spells involuntarily.",
  "I once won a drinking contest against the God of Wine.",
  "I can read the future, but only for things that happened yesterday.",
  "I have a personal cloud that follows me around and rains on my enemies.",
  "I once punched a hole in reality because I was bored.",
  "I can breathe underwater, but I'm severely allergic to fish.",
  "I once killed a god with a really strongly worded letter.",
  "I have a magic mirror that only shows me my worst angles.",
  "I once ran so fast I accidentally traveled back in time.",
  "I can speak to animals, but they all have existential crises.",
  "I once sneezed so hard I accidentally cast a fireball.",
  "I have a tail that has its own personality and votes on decisions.",
  "I once arm-wrestled a mountain and the mountain flinched.",
  "I can taste the difference between a Tuesday and a Thursday.",
  "I once ate a candle and now I glow in the dark.",
  "I have an imaginary friend who is actually very real and very judgmental.",
  "I once fought a sock puppet and lost.",
  "I can speak fluent fish but only in haiku.",
  "I once sneezed and accidentally started a religion.",
  "I have a scar from fighting my own shadow. It won.",
  "I once made a dragon cry by telling it a sad story about taxes.",
  "I can predict the weather but only for planets that don't exist.",
  "I once threw a rock and hit a bird that turned out to be a god. Awkward.",
  "I have a magic carpet but it's severely arachnophobic.",
  "I once confused a lich with a regular old man and nearly adopted it.",
  "I can turn invisible but only when nobody is looking at me anyway.",
];

// ─── Likes & Dislikes ───

const LIKES = [
  "sunsets", "sparring", "reading", "silence", "rain", "fire", "animals",
  "music", "fighting", "eating", "sleeping", "traveling", "mischief",
  "puzzles", "night sky", "ocean", "thunderstorms", "stars", "ancient ruins",
  "magic", "collecting weapons", "telling stories", "campfires",
  "exploring dungeons", "stargazing", "cooking", "dancing",
  "kart racing", "picking locks", "napping in trees", "petting cats",
  "breaking rules", "making people laugh", "long walks at midnight",
  "haggling with merchants", "reading forbidden books", "building things",
  "destroying things", "baking", "swimming", "climbing",
  "writing poetry", "gambling", "stargazing", "napping",
  "collecting rare coins", "taming monsters", "singing off-key",
];

const DISLIKES = [
  "betrayal", "boredom", "authority", "crowds", "bright light", "silence",
  "cold", "heat", "liars", "cowards", "magic", "technology", "rules",
  "patience", "weakness", "arrogance", "bureaucracy", "mornings", "water",
  "small talk", "being told what to do", "waking up early",
  "running out of snacks", "people who chew loudly", "being underestimated",
  "taxes", "prophecies", "chosen ones", "the sound of fingernails on chalk",
  "unnecessary exposition", "plot armor", "being interrupted mid-monologue",
  "people who don't knock", "cold tea", "wet socks", "empty cupboards",
  "moral absolutism", "injustice", "bored gods", "repetitive quests",
];

// ─── Likes & Dislikes generators ───

const LIKES_POOL = [
  "sunsets", "sparring", "reading", "silence", "rain", "fire", "animals",
  "music", "fighting", "eating", "sleeping", "traveling", "mischief",
  "puzzles", "night sky", "ocean", "thunderstorms", "stars", "ancient ruins",
  "magic", "collecting weapons", "telling stories", "campfires",
  "exploring dungeons", "stargazing", "cooking", "dancing",
  "kart racing", "picking locks", "napping in trees", "petting cats",
  "breaking rules", "making people laugh", "long walks at midnight",
  "haggling with merchants", "reading forbidden books", "building things",
  "destroying things", "baking", "swimming", "climbing",
  "writing poetry", "gambling", "napping",
  "collecting rare coins", "taming monsters", "singing off-key",
];

const DISLIKES_POOL = [
  "betrayal", "boredom", "authority", "crowds", "bright light", "silence",
  "cold", "heat", "liars", "cowards", "technology", "rules",
  "patience", "weakness", "arrogance", "bureaucracy", "mornings",
  "small talk", "being told what to do", "running out of snacks",
  "people who chew loudly", "being underestimated",
  "taxes", "prophecies", "chosen ones", "the sound of fingernails on chalk",
  "unnecessary exposition", "plot armor", "being interrupted mid-monologue",
  "people who don't knock", "cold tea", "wet socks", "empty cupboards",
  "moral absolutism", "injustice", "bored gods", "repetitive quests",
];

// ─── Generators ───

export function randomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

const OCCUPATIONS = [
  "Royal guard", "Smuggler", "Healer", "Mercenary", "Blacksmith", "Scholar",
  "Pirate captain", "Assassin", "Mage", "Bard", "Farmer", "Alchemist",
  "Monster hunter", "Spy", "Thief", "Necromancer", "Diplomat", "Gladiator",
  "Witcher", "Paladin", "Rogue", "Enchanter", "Shipwright", "Tavern keeper",
  "Cartographer", "Grave digger", "Demon hunter", "Astronomer", "Scribe",
  "Weaponsmith", "Herbalist", "Scout", "Courier", "Debt collector",
  "Treasure hunter", "Exorcist", "Bounty hunter", "Oracle", "Warlord",
  "Champion", "Jester", "Artificer", "Elementalist", "Tamer",
];

const HOMEWORLDS = [
  "Shadow Realm", "Mars Colony", "The Underworld", "Floating City of Aether",
  "Enchanted Forest", "Crystal Caverns", "Void Between Worlds", "Forgotten Kingdom",
  "Dragon's Peak", "Neon-lit Sprawl", "Ancient Ruins", "Celestial Plane",
  "Shadowfell", "Material Plane", "Astral Sea", "Feywild",
  "Mechanical Empire", "Sunken City", "Volcanic Wastes", "Frozen Tundra",
  "Parallel Dimension", "Dream Realm", "Spirit World", "Time-Lost Past",
  "Post-Apocalyptic Earth", "Starship Wanderer", "Pocket Dimension",
  "Blood Moon Wasteland", "Ethereal Plane", "Demonic Plane",
  "Library of Infinite Books", "Endless Labyrinth", "The Void",
  "Crystal Spire", "Iron Citadel", "Whispering Marshes", "Obsidian Tower",
  "Gilded Palace", "Twilight Court", "Dawnbreak Fortress", "Nightshade Thicket",
];

export function randomFields(): Record<string, string> {
  return {
    name: randomName(),
    age: `${randInt(16, 500)} years`,
    species: pick(SPECIES),
    gender: pick(GENDERS),
    orientation: pick(ORIENTATIONS),
    romantic: pick(ROMANTIC_ORIENTATIONS),
    height: (() => { const inches = randInt(48, 95); const ft = Math.floor(inches / 12); const inc = inches % 12; const cm = Math.round(inches * 2.54); return `${ft}'${inc}" (${cm}cm)`; })(),
    hair: `${pick(HAIR_STYLES)}, ${pick(HAIR_COLORS)}`,
    eyes: pick(EYE_COLORS),
    bodyType: pick(BODY_TYPES),
    features: pickN(FEATURES, randInt(2, 4)).join(", "),
    personality: pickN(PERSONALITIES, randInt(2, 3)).join(", "),
    backstory: pick(BACKSTORIES),
    occupation: pick(OCCUPATIONS),
    homeworld: pick(HOMEWORLDS),
    strengths: pickN(STRENGTHS, randInt(2, 3)).join(", "),
    weaknesses: pickN(WEAKNESSES, randInt(2, 3)).join(", "),
    likes: pickN(LIKES_POOL, randInt(3, 5)).join(", "),
    dislikes: pickN(DISLIKES_POOL, randInt(3, 5)).join(", "),
    quote: pick(QUOTES),
  };
}

export function randomTruthsAndLie(): [string, string, string] {
  const truths = pickN(TRUTH_TEMPLATES, 2);
  const lie = pick(LIE_TEMPLATES);
  return [truths[0], truths[1], lie];
}

export function randomTags(count: number = 5): string[] {
  return pickN(TAGS_POOL, count);
}

export function randomSeekingTags(count: number = 5): string[] {
  return pickN(SEEKING_TAGS, count);
}

export interface RandomOCData {
  name: string;
  fields: Record<string, string>;
  tags: string[];
  truthsAndLie: [string, string, string];
}

export function generateRandomOC(): RandomOCData {
  const fields = randomFields();
  return {
    name: fields.name,
    fields,
    tags: randomTags(randInt(3, 6)),
    truthsAndLie: randomTruthsAndLie(),
  };
}

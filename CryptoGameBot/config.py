from pathlib import Path

# ── Paths ──────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
LOGS_DIR = BASE_DIR / "logs"

# Template image paths
POND_TEMPLATE = str(TEMPLATES_DIR / "pond.png")
CATCH_POPUP_TEMPLATE = str(TEMPLATES_DIR / "catch_popup.png")

# ── Screen capture ─────────────────────────────────────
# Set to [left, top, width, height] to restrict scanning
# to a specific monitor region (e.g. the game window).
# Set to None to scan the entire primary monitor.
GAME_REGION = None
# GAME_REGION = [100, 200, 1600, 900]

# ── Template matching ──────────────────────────────────
# Confidence threshold (0.0 – 1.0). Lower = more matches
# but more false positives.  Start at 0.8 and adjust.
CONFIDENCE = 0.8

# ── Timing (seconds) ───────────────────────────────────
CAST_COOLDOWN = 30
POPUP_CHECK_INTERVAL = 0.5
CLICK_DELAY = 0.3
POST_CLICK_PAUSE = 0.8
POND_RETRY_DELAY = 1.0
POND_MAX_RETRIES = 5

# ── Mouse behaviour ────────────────────────────────────
# Add small random offsets (±px) to clicks so the
# pattern is less detectable by anti-bot systems.
CLICK_JITTER = 5

# ── Hotkeys ────────────────────────────────────────────
HOTKEY_PAUSE = "f6"
HOTKEY_QUIT = "esc"

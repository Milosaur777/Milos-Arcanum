"""Fishing mini-game automation bot for a browser-based crypto game.

State machine:
  SCANNING  → popup detected → CLICK_POPUP
  CLICK_POPUP → clicked     → CLICK_POND
  CLICK_POND  → clicked     → WAITING
  WAITING     → cooldown up  → SCANNING

Hotkeys:
  F6  – pause / resume
  ESC – quit
"""

from __future__ import annotations

import sys
import time
import logging
from enum import Enum, auto
from datetime import datetime, timezone

import keyboard

from config import (
    CAST_COOLDOWN,
    POPUP_CHECK_INTERVAL,
    CLICK_DELAY,
    POST_CLICK_PAUSE,
    POND_RETRY_DELAY,
    POND_MAX_RETRIES,
    CONFIDENCE,
    CLICK_JITTER,
    GAME_REGION,
    CATCH_POPUP_TEMPLATE,
    POND_TEMPLATE,
    LOGS_DIR,
    HOTKEY_PAUSE,
    HOTKEY_QUIT,
)
from capture import grab_screen
from detector import find_template
from clicker import click_at

# ── Logging ────────────────────────────────────────────
LOGS_DIR.mkdir(parents=True, exist_ok=True)
log_file = LOGS_DIR / f"fishing_bot_{datetime.now(tz=timezone.utc).strftime('%Y%m%d_%H%M%S')}.log"

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(str(log_file), encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)


# ── State machine ──────────────────────────────────────
class State(Enum):
    SCANNING = auto()
    CLICK_POPUP = auto()
    CLICK_POND = auto()
    WAITING = auto()


# ── Globals ────────────────────────────────────────────
_paused = False
_quit = False


def _on_pause() -> None:
    global _paused
    _paused = not _paused
    log.info(">>> PAUSED <<<" if _paused else ">>> RESUMED <<<")


def _on_quit() -> None:
    global _quit
    _quit = True
    log.info(">>> QUIT signal received – shutting down...")


keyboard.add_hotkey(HOTKEY_PAUSE, _on_pause)
keyboard.add_hotkey(HOTKEY_QUIT, _on_quit)


# ── Helpers ────────────────────────────────────────────
def _region_str() -> str:
    if GAME_REGION:
        return f"region=[{', '.join(str(v) for v in GAME_REGION)}]"
    return "full-screen"


def _ensure_templates_exist() -> None:
    from pathlib import Path
    for name, path in [("catch_popup", CATCH_POPUP_TEMPLATE), ("pond", POND_TEMPLATE)]:
        if not Path(path).is_file():
            log.error("Template missing: %s – save your screenshot as %s", name, path)
            sys.exit(1)


# ── Main loop ──────────────────────────────────────────
def main() -> None:
    _ensure_templates_exist()

    state = State.SCANNING
    last_cast: float = 0.0
    cycle_count = 0

    log.info("Fishing bot started  |  %s  |  confidence=%.2f", _region_str(), CONFIDENCE)
    log.info("Hotkeys: %s = pause/resume  |  %s = quit", HOTKEY_PAUSE.upper(), HOTKEY_QUIT.upper())
    log.info("─" * 50)

    while not _quit:
        # ── Pause check ────────────────────────────────
        if _paused:
            time.sleep(0.2)
            continue

        # ── State dispatch ─────────────────────────────
        match state:

            case State.SCANNING:
                if time.time() - last_cast < CAST_COOLDOWN:
                    time.sleep(POPUP_CHECK_INTERVAL * 2)
                    continue

                screen = grab_screen(GAME_REGION)
                match = find_template(screen, CATCH_POPUP_TEMPLATE, CONFIDENCE)

                if match is not None:
                    cx, cy, conf = match
                    log.info("Popup found at (%d, %d)  confidence=%.3f", cx, cy, conf)
                    state = State.CLICK_POPUP
                else:
                    time.sleep(POPUP_CHECK_INTERVAL)

            case State.CLICK_POPUP:
                screen = grab_screen(GAME_REGION)
                match = find_template(screen, CATCH_POPUP_TEMPLATE, CONFIDENCE)

                if match is not None:
                    cx, cy, _ = match
                    click_at(cx, cy, CLICK_JITTER)
                    log.info("Clicked popup")
                    time.sleep(CLICK_DELAY)

                state = State.CLICK_POND

            case State.CLICK_POND:
                pond_found = False
                for attempt in range(POND_MAX_RETRIES):
                    screen = grab_screen(GAME_REGION)
                    match = find_template(screen, POND_TEMPLATE, CONFIDENCE)

                    if match is not None:
                        cx, cy, conf = match
                        click_at(cx, cy, CLICK_JITTER)
                        log.info("Pond found at (%d, %d)  confidence=%.3f  |  line cast", cx, cy, conf)
                        pond_found = True
                        break

                    log.info("Pond not found (attempt %d/%d), retrying…", attempt + 1, POND_MAX_RETRIES)
                    time.sleep(POND_RETRY_DELAY)

                if pond_found:
                    state = State.WAITING
                    last_cast = time.time()
                else:
                    log.warning("Pond not found after %d attempts – skipping this cycle", POND_MAX_RETRIES)
                    state = State.SCANNING

                time.sleep(POST_CLICK_PAUSE)

            case State.WAITING:
                remaining = CAST_COOLDOWN - (time.time() - last_cast)
                if remaining > 0:
                    log.info("Cooldown: %.0fs remaining", remaining)
                    # Sleep in short chunks so we can respond to hotkeys
                    slept = 0.0
                    while slept < remaining and not _quit and not _paused:
                        time.sleep(1.0)
                        slept += 1.0
                else:
                    state = State.SCANNING

        cycle_count += 1

    log.info("Bot shut down after %d cycles.", cycle_count)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log.info("Interrupted by user.")
        sys.exit(0)

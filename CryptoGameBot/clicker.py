import random
import pyautogui

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.05


def click_at(x: int, y: int, jitter: int = 5) -> None:
    """Move mouse to (x, y) with a small random offset and click.

    Args:
        x: Target X coordinate.
        y: Target Y coordinate.
        jitter: Max pixels of random offset in any direction.
    """
    ox = random.randint(-jitter, jitter)
    oy = random.randint(-jitter, jitter)
    pyautogui.moveTo(x + ox, y + oy, duration=random.uniform(0.08, 0.18))
    pyautogui.click()


def move_to(x: int, y: int) -> None:
    """Move mouse without clicking."""
    pyautogui.moveTo(x, y, duration=random.uniform(0.08, 0.18))

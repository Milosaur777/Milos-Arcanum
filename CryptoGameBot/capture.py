import mss
import numpy as np

_sct = mss.mss()


def grab_screen(region: list[int] | None = None) -> np.ndarray:
    """Capture a screen region and return it as a BGRA numpy array.

    Args:
        region: [left, top, width, height] or None for full primary monitor.

    Returns:
        BGRA numpy array (shape: H x W x 4).
    """
    monitor = {"left": region[0], "top": region[1], "width": region[2], "height": region[3]} if region else _sct.monitors[1]
    sct_img = _sct.grab(monitor)
    return np.array(sct_img)


def screen_size() -> tuple[int, int]:
    """Return (width, height) of the primary monitor."""
    m = _sct.monitors[1]
    return m["width"], m["height"]

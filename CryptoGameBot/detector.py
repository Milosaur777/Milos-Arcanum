import cv2
import numpy as np


def find_template(
    haystack: np.ndarray,
    needle_path: str,
    confidence: float = 0.8,
) -> tuple[int, int, float] | None:
    """Locate *needle_path* template inside *haystack* image.

    Args:
        haystack: BGRA / BGR numpy array (output of capture.grab_screen).
        needle_path: Filesystem path to the template PNG.
        confidence: Minimum match quality (0.0 – 1.0).

    Returns:
        (center_x, center_y, match_confidence) of the best match,
        or None if nothing meets the confidence threshold.
    """
    template = cv2.imread(needle_path, cv2.IMREAD_UNCHANGED)

    if template is None:
        raise FileNotFoundError(f"Template not found: {needle_path}")

    method = cv2.TM_CCOEFF_NORMED

    # If haystack has alpha (BGRA) but template is BGR, strip alpha
    if haystack.shape[2] == 4 and template.shape[2] == 3:
        haystack = cv2.cvtColor(haystack, cv2.COLOR_BGRA2BGR)
    # If both have alpha, match on alpha too
    # If template has alpha and haystack doesn't, strip template alpha
    if template.shape[2] == 4 and haystack.shape[2] == 3:
        template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

    result = cv2.matchTemplate(haystack, template, method)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)

    if max_val >= confidence:
        h, w = template.shape[:2]
        cx = max_loc[0] + w // 2
        cy = max_loc[1] + h // 2
        return cx, cy, max_val

    return None

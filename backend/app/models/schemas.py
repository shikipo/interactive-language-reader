from pydantic import BaseModel
from dataclasses import dataclass


class PageRequest(BaseModel):
    page_number: int


class HoverRequest(BaseModel):
    session_id: str
    page_number: int
    x: float  # coordinates as % of image size (0-100)
    y: float  # using % makes it resolution-independent
    target_language: str
    source_language: str


@dataclass
class TextRegion:
    block_num: int
    text: str
    x: int
    y: int
    width: int
    height: int

    def contains(self, x: float, y: float, img_width: int, img_height: int) -> bool:
        """Check if given % coordinates fall inside this region."""
        abs_x = (x / 100) * img_width
        abs_y = (y / 100) * img_height
        return (self.x <= abs_x <= self.x + self.width and
                self.y <= abs_y <= self.y + self.height)
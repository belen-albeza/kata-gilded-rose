use lazy_static::lazy_static;
use regex::Regex;
use serde::Serialize;
use std::fmt::{self, Display};

#[derive(Debug, PartialEq, Clone, Serialize)]
pub struct Item {
    pub name: String,
    pub sell_in: i32,
    pub quality: i32,
}

impl Item {
    pub fn new(name: impl Into<String>, sell_in: i32, quality: i32) -> Item {
        Item {
            name: name.into(),
            sell_in,
            quality,
        }
    }
}

impl Display for Item {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}, {}, {}", self.name, self.sell_in, self.quality)
    }
}

pub struct GildedRose {
    pub items: Vec<Item>,
}

impl GildedRose {
    pub fn new(items: Vec<Item>) -> GildedRose {
        GildedRose { items }
    }

    pub fn update_quality(&mut self) {
        for item in &mut self.items {
            if item.name != "Aged Brie" && item.name != "Backstage passes to a TAFKAL80ETC concert"
            {
                if item.quality > 0 {
                    if item.name != "Sulfuras, Hand of Ragnaros" {
                        item.quality = item.quality - 1;
                    }
                }
            } else {
                if item.quality < 50 {
                    item.quality = item.quality + 1;

                    if item.name == "Backstage passes to a TAFKAL80ETC concert" {
                        if item.sell_in < 11 {
                            if item.quality < 50 {
                                item.quality = item.quality + 1;
                            }
                        }

                        if item.sell_in < 6 {
                            if item.quality < 50 {
                                item.quality = item.quality + 1;
                            }
                        }
                    }
                }
            }

            if item.name != "Sulfuras, Hand of Ragnaros" {
                item.sell_in = item.sell_in - 1;
            }

            if item.sell_in < 0 {
                if item.name != "Aged Brie" {
                    if item.name != "Backstage passes to a TAFKAL80ETC concert" {
                        if item.quality > 0 {
                            if item.name != "Sulfuras, Hand of Ragnaros" {
                                item.quality = item.quality - 1;
                            }
                        }
                    } else {
                        item.quality = item.quality - item.quality;
                    }
                } else {
                    if item.quality < 50 {
                        item.quality = item.quality + 1;
                    }
                }
            }
        }
    }
}

#[derive(Debug, PartialEq, Clone, Copy)]
enum ItemKind {
    Common,
    Aged,
    BackstagePass,
    Legendary,
}

impl From<&str> for ItemKind {
    fn from(raw: &str) -> Self {
        lazy_static! {
            static ref RE_AGED: Regex = Regex::new(r"^Aged(\s.+)?").unwrap();
            static ref RE_LEGENDARY: Regex = Regex::new(r"^Sulfuras([,\s].+)?").unwrap();
            static ref RE_PASS: Regex = Regex::new(r"^Backstage pass(es)?(\s.+)?").unwrap();
        }

        if RE_AGED.is_match(raw) {
            ItemKind::Aged
        } else if RE_LEGENDARY.is_match(raw) {
            ItemKind::Legendary
        } else if RE_PASS.is_match(raw) {
            ItemKind::BackstagePass
        } else {
            ItemKind::Common
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_item_kind_from_string() {
        assert_eq!(ItemKind::from("Lorem ipsum"), ItemKind::Common);
        assert_eq!(
            ItemKind::from("Sulfuras, the Hand of Ragnaros"),
            ItemKind::Legendary
        );
        assert_eq!(ItemKind::from("Sulfuras"), ItemKind::Legendary);
        assert_eq!(
            ItemKind::from("Backstage passes to a concert"),
            ItemKind::BackstagePass
        );
        assert_eq!(ItemKind::from("Aged Brie"), ItemKind::Aged);
    }
}

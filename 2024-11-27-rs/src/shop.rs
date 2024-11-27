use serde::Serialize;
use std::{
    cmp::{max, min},
    fmt::{self, Display},
};

mod core;

use core::Kind;

#[derive(Serialize, Debug, PartialEq, Clone)]
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

    pub fn items(&self) -> Vec<Item> {
        self.items.to_owned()
    }

    pub fn update_quality(&mut self) {
        for item in self.items.iter_mut() {
            Self::update_item(item)
        }
    }

    fn update_item(item: &mut Item) {
        let kind = Kind::from(item.name.as_str());

        let quality_delta = match kind {
            Kind::BackstagePass => Some(match item.sell_in {
                x if x < 11 => 2,
                x if x < 6 => 3,
                _ => 1,
            }),
            Kind::Sulfuras => None,
            Kind::Aged => Some(1),
            _ => Some(-1),
        };

        if let Some(delta) = quality_delta {
            item.quality = min(max(0, item.quality + delta), 50);
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

#[cfg(test)]
mod tests {
    use super::*;
}

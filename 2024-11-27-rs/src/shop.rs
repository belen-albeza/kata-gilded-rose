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

        item.sell_in = match kind {
            Kind::Sulfuras => item.sell_in,
            _ => item.sell_in - 1,
        };

        let quality_delta = match (kind, item.sell_in) {
            (Kind::BackstagePass, sell) if sell < 0 => Some(-item.quality),
            (Kind::BackstagePass, sell) if sell < 5 => Some(3),
            (Kind::BackstagePass, sell) if sell < 10 => Some(2),
            (Kind::BackstagePass, _) => Some(1),
            (Kind::Sulfuras, _) => None,
            (Kind::Aged, sell) if sell < 0 => Some(2),
            (Kind::Aged, _) => Some(1),
            (_, sell) if sell < 0 => Some(-2),
            _ => Some(-1),
        };

        if let Some(delta) = quality_delta {
            item.quality = min(max(0, item.quality + delta), 50);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
}

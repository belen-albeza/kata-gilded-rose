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
            let (quality, sell_in) = Self::updated_item_values(item);
            item.quality = quality;
            item.sell_in = sell_in;
        }
    }

    fn updated_item_values(item: &Item) -> (i32, i32) {
        let kind = Kind::from(item.name.as_str());

        let sell_in = match kind {
            Kind::Sulfuras => item.sell_in,
            _ => item.sell_in - 1,
        };

        let quality_delta = match (kind, sell_in) {
            (Kind::BackstagePass, sell) if sell < 0 => Some(-item.quality),
            (Kind::BackstagePass, sell) if sell < 5 => Some(3),
            (Kind::BackstagePass, sell) if sell < 10 => Some(2),
            (Kind::BackstagePass, _) => Some(1),
            (Kind::Sulfuras, _) => None,
            (Kind::Aged, sell) if sell < 0 => Some(2),
            (Kind::Aged, _) => Some(1),
            (Kind::Conjured, sell) if sell < 0 => Some(-4),
            (Kind::Conjured, _) => Some(-2),
            (_, sell) if sell < 0 => Some(-2),
            _ => Some(-1),
        };

        let quality = if let Some(delta) = quality_delta {
            min(max(0, item.quality + delta), 50)
        } else {
            item.quality
        };

        (quality, sell_in)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn conjured_items_degrade_twice_as_fast() {
        let item = Item::new("Conjured Foo", 1, 10);
        let (quality, sell_in) = GildedRose::updated_item_values(&item);

        assert_eq!(quality, 8);
        assert_eq!(sell_in, 0);
    }

    #[test]
    fn expired_conjured_items_degrade_twice_as_fast() {
        let item = Item::new("Conjured Foo", 0, 10);
        let (quality, sell_in) = GildedRose::updated_item_values(&item);

        assert_eq!(quality, 6);
        assert_eq!(sell_in, -1);
    }
}

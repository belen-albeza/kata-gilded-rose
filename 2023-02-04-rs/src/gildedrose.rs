use lazy_static::lazy_static;
use regex::Regex;
use serde::Serialize;
use std::cmp::{max, min};
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
        self.items = self.items.iter().map(|x| Self::update_item(x)).collect()
    }

    fn update_item(item: &Item) -> Item {
        let kind = ItemKind::from(item.name.as_str());
        let updater = Into::<Box<dyn ItemUpdater>>::into(kind);

        updater.update(item)
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

impl Into<Box<dyn ItemUpdater>> for ItemKind {
    fn into(self) -> Box<dyn ItemUpdater> {
        match self {
            Self::Common => Box::new(CommonUpdater {}),
            Self::Legendary => Box::new(LegendaryUpdater {}),
            Self::BackstagePass => Box::new(BackstagePassUpdater {}),
            Self::Aged => Box::new(AgedUpdater {}),
        }
    }
}

trait ItemUpdater {
    fn max_quality(&self) -> i32 {
        50
    }

    fn update(&self, item: &Item) -> Item {
        item.clone()
    }
}

struct LegendaryUpdater {}
impl ItemUpdater for LegendaryUpdater {}

struct CommonUpdater {}

impl ItemUpdater for CommonUpdater {
    fn update(&self, item: &Item) -> Item {
        let sell_in = item.sell_in - 1;
        let mut quality = item.quality - 1;
        if sell_in < 0 {
            quality -= 1
        }

        Item::new(item.name.to_owned(), sell_in, max(0, quality))
    }
}

struct AgedUpdater {}

impl ItemUpdater for AgedUpdater {
    fn update(&self, item: &Item) -> Item {
        let sell_in = item.sell_in - 1;
        let mut quality = item.quality + 1;
        if sell_in < 0 {
            quality += 1;
        }

        Item::new(
            item.name.to_owned(),
            sell_in,
            min(quality, self.max_quality()),
        )
    }
}

struct BackstagePassUpdater {}

impl ItemUpdater for BackstagePassUpdater {
    fn update(&self, item: &Item) -> Item {
        let quality = item.quality
            + match item.sell_in {
                i32::MIN..=0 => -item.quality,
                1..=5 => 3,
                6..=10 => 2,
                11..=i32::MAX => 1,
            };

        let sell_in = item.sell_in - 1;

        Item::new(
            item.name.to_owned(),
            sell_in,
            min(quality, self.max_quality()),
        )
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

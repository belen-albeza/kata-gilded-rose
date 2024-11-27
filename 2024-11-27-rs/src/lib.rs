mod shop;

pub use shop::{GildedRose, Item};

pub fn sample_items() -> Vec<Item> {
    vec![
        Item::new("+5 Dexterity Vest", 10, 20),
        Item::new("Aged Brie", 2, 0),
        Item::new("Elixir of the Mongoose", 5, 7),
        Item::new("Sulfuras, Hand of Ragnaros", 0, 80),
        Item::new("Sulfuras, Hand of Ragnaros", -1, 80),
        Item::new("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        Item::new("Backstage passes to a TAFKAL80ETC concert", 10, 49),
        Item::new("Backstage passes to a TAFKAL80ETC concert", 5, 49),
        // this conjured item does not work properly yet
        // Item::new("Conjured Mana Cake", 3, 6),
    ]
}

pub fn run(days: usize) -> Vec<Item> {
    let mut shop = GildedRose::new(sample_items());

    for _ in 0..days {
        shop.update_quality();
    }

    shop.items()
}

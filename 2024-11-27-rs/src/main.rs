use gildedrose::GildedRose;

fn main() {
    let items = gildedrose::sample_items();
    let mut rose = GildedRose::new(items);

    println!("OMGHAI!");
    for i in 0..=30 {
        println!("-------- day {} --------", i);
        println!("name, sellIn, quality");
        for item in &rose.items() {
            println!("{}", item);
        }
        println!();
        rose.update_quality();
    }
}

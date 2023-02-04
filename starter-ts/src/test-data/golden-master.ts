import { Item, GildedRose } from "../gilded-rose";

export default function runGildedRose(days: number): string {
  const items = [
    new Item("+5 Dexterity Vest", 10, 20),
    new Item("Aged Brie", 2, 0),
    new Item("Elixir of the Mongoose", 5, 7),
    new Item("Sulfuras, Hand of Ragnaros", 0, 80),
    new Item("Sulfuras, Hand of Ragnaros", -1, 80),
    new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
    new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
    new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
    new Item("Conjured Mana Cake", 3, 6),
  ];

  const gildedRose = new GildedRose(items);

  let output = "";

  for (let i = 0; i < days; i++) {
    output += `-------- day ${i} --------\n`;
    output += `name, sellIn, quality\n`;
    gildedRose.items.forEach((element) => {
      output += `${element.name} ${element.sellIn} ${element.quality}\n`;
    });
    output += "\n";
    gildedRose.updateQuality();
  }

  return output;
}

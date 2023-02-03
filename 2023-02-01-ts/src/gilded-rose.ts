export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items = this.items.map(updateQualityForItem);
    return this.items;
  }
}

function updateQualityForItem(item: Item): Item {
  let quality = item.quality;
  let sellIn = item.sellIn;

  if (
    item.name != "Aged Brie" &&
    item.name != "Backstage passes to a TAFKAL80ETC concert"
  ) {
    if (quality > 0) {
      if (item.name != "Sulfuras, Hand of Ragnaros") {
        quality = quality - 1;
      }
    }
  } else {
    if (quality < 50) {
      quality = quality + 1;
      if (item.name == "Backstage passes to a TAFKAL80ETC concert") {
        if (sellIn < 11) {
          if (quality < 50) {
            quality = quality + 1;
          }
        }
        if (sellIn < 6) {
          if (quality < 50) {
            quality = quality + 1;
          }
        }
      }
    }
  }

  if (item.name != "Sulfuras, Hand of Ragnaros") {
    sellIn = sellIn - 1;
  }

  if (sellIn < 0) {
    if (item.name != "Aged Brie") {
      if (item.name != "Backstage passes to a TAFKAL80ETC concert") {
        if (quality > 0) {
          if (item.name != "Sulfuras, Hand of Ragnaros") {
            quality = quality - 1;
          }
        }
      } else {
        quality = quality - quality;
      }
    } else {
      if (quality < 50) {
        quality = quality + 1;
      }
    }
  }

  return new Item(item.name, sellIn, quality);
}

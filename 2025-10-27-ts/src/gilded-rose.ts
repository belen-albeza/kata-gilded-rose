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

class GildedItem {
  readonly #rawItem: Item;

  constructor(rawItem: Item) {
    this.#rawItem = rawItem;
  }

  updateQuality(): number {
    let quality = this.#rawItem.quality;

    if (
      this.#rawItem.name != "Aged Brie" &&
      this.#rawItem.name != "Backstage passes to a TAFKAL80ETC concert"
    ) {
      if (this.#rawItem.quality > 0) {
        if (this.#rawItem.name != "Sulfuras, Hand of Ragnaros") {
          quality = this.#rawItem.quality - 1;
        }
      }
    } else {
      if (this.#rawItem.quality < 50) {
        quality = this.#rawItem.quality + 1;
        if (this.#rawItem.name == "Backstage passes to a TAFKAL80ETC concert") {
          if (this.#rawItem.sellIn < 11) {
            if (quality < 50) {
              quality += 1;
            }
          }
          if (this.#rawItem.sellIn < 6) {
            if (quality < 50) {
              quality += 1;
            }
          }
        }
      }
    }

    return quality;
  }

  updateSellIn(): { quality: number; sellIn: number } {
    let sellIn = this.#rawItem.sellIn;
    let quality = this.#rawItem.quality;

    if (this.#rawItem.name != "Sulfuras, Hand of Ragnaros") {
      sellIn = sellIn - 1;
    }

    if (sellIn < 0) {
      if (this.#rawItem.name != "Aged Brie") {
        if (this.#rawItem.name != "Backstage passes to a TAFKAL80ETC concert") {
          if (this.#rawItem.quality > 0) {
            if (this.#rawItem.name != "Sulfuras, Hand of Ragnaros") {
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

    return { quality, sellIn };
  }
}

export class GildedRose {
  #items: Item[];

  constructor(items = [] as Item[]) {
    this.#items = items;
  }

  get items() {
    return [...this.#items];
  }

  updateQuality(): Item[] {
    for (let i = 0; i < this.#items.length; i++) {
      const item = this.items[i];
      if (item !== undefined) {
        this.#items[i] = GildedRose.#updateItem(item);
      }
    }

    return this.#items;
  }

  static #updateItem(item: Item): Item {
    item.quality = new GildedItem(item).updateQuality();
    const { quality, sellIn } = new GildedItem(item).updateSellIn();

    return new Item(item.name, sellIn, quality);
  }
}

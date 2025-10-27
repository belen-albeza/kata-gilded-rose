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

type Quirk = "aged" | "passes" | "sulfuras";

class GildedItem {
  readonly #rawItem: Item;
  readonly quirk: undefined | Quirk;

  constructor(rawItem: Item) {
    this.#rawItem = rawItem;
    this.quirk = GildedItem.#quirkFromName(rawItem.name.toLowerCase());
  }

  static #quirkFromName(name: string): Quirk | undefined {
    if (name.startsWith("aged")) {
      return "aged";
    }

    if (name === "sulfuras, hand of ragnaros") {
      return "sulfuras";
    }

    if (name.startsWith("backstage passes")) {
      return "passes";
    }

    return undefined;
  }

  updateQuality(): number {
    let quality = this.#rawItem.quality;

    if (this.quirk != "aged" && this.quirk != "passes") {
      if (this.#rawItem.quality > 0) {
        if (this.quirk != "sulfuras") {
          quality = this.#rawItem.quality - 1;
        }
      }
    } else {
      if (this.#rawItem.quality < 50) {
        quality = this.#rawItem.quality + 1;
        if (this.quirk == "passes") {
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

    if (this.quirk != "sulfuras") {
      sellIn = sellIn - 1;
    }

    if (sellIn < 0) {
      if (this.quirk != "aged") {
        if (this.quirk != "passes") {
          if (this.#rawItem.quality > 0) {
            if (this.quirk != "sulfuras") {
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
    this.#items = this.#items.map(GildedRose.#updateItem);
    return this.#items;
  }

  static #updateItem(item: Item): Item {
    item.quality = new GildedItem(item).updateQuality();
    const { quality, sellIn } = new GildedItem(item).updateSellIn();

    return new Item(item.name, sellIn, quality);
  }
}

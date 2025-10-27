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

class ShopItem {
  readonly #rawItem: Item;
  readonly quirk: undefined | Quirk;

  constructor(rawItem: Item) {
    this.#rawItem = rawItem;
    this.quirk = ShopItem.quirkFromName(rawItem.name.toLowerCase());
  }

  static quirkFromName(name: string): Quirk | undefined {
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
          if (quality > 0) {
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

abstract class GildedItem {
  protected readonly sellIn: number;
  protected readonly quality: number;

  constructor(sellIn: number, quality: number) {
    this.quality = quality;
    this.sellIn = sellIn;
  }

  abstract update(): { quality: number; sellIn: number };
}

class CommonItem extends GildedItem {
  update(): { quality: number; sellIn: number } {
    let sellIn = this.sellIn - 1;
    let quality = sellIn < 0 ? this.quality - 2 : this.quality - 1;
    quality = Math.min(Math.max(0, quality), 50);

    return { quality, sellIn };
  }
}

class GildedItemFactory {
  static newGildedItem(item: Item): GildedItem | undefined {
    let quirk = ShopItem.quirkFromName(item.name.toLowerCase());

    switch (quirk) {
      case "aged":
        return undefined; // TODO
      case "sulfuras":
        return undefined; // TODO
      case "passes":
        return undefined; // TODO
      default:
        return new CommonItem(item.sellIn, item.quality);
    }
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
    let gildedItem = GildedItemFactory.newGildedItem(item);
    if (gildedItem) {
      const { quality, sellIn } = gildedItem.update();
      return new Item(item.name, sellIn, quality);
    }

    item.quality = new ShopItem(item).updateQuality();
    const { quality, sellIn } = new ShopItem(item).updateSellIn();

    return new Item(item.name, sellIn, quality);
  }
}

import { GildedItemFactory } from "./items";

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
    const gildedItem = GildedItemFactory.newGildedItem(item);
    gildedItem.update();
    return new Item(item.name, gildedItem.sellIn, gildedItem.quality);
  }
}

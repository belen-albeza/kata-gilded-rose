import { Item } from "./gilded-rose";

export abstract class GildedItem {
  #sellIn: number;
  #quality: number;

  constructor(sellIn: number, quality: number) {
    this.#quality = quality;
    this.#sellIn = sellIn;
  }

  abstract update(): void;

  get sellIn() {
    return this.#sellIn;
  }

  set sellIn(value: number) {
    this.#sellIn = value;
  }

  get quality() {
    return this.#quality;
  }

  set quality(value: number) {
    this.#quality = Math.min(Math.max(0, value), 50);
  }
}

type Quirk = "aged" | "passes" | "sulfuras" | "conjured";

export class GildedItemFactory {
  static newGildedItem(item: Item): GildedItem {
    let quirk = GildedItemFactory.#quirkFromName(item.name.toLowerCase());

    switch (quirk) {
      case "aged":
        return new AgedItem(item.sellIn, item.quality);
      case "sulfuras":
        return new Sulfuras(item.sellIn, item.quality);
      case "passes":
        return new BackstagePassItem(item.sellIn, item.quality);
      case "conjured":
        return new ConjuredItem(item.sellIn, item.quality);
      default:
        return new CommonItem(item.sellIn, item.quality);
    }
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

    if (name.startsWith("conjured")) {
      return "conjured";
    }

    return undefined;
  }
}

export class CommonItem extends GildedItem {
  update() {
    this.sellIn -= 1;
    this.quality += this.sellIn < 0 ? -2 : -1;
  }
}

export class AgedItem extends GildedItem {
  update() {
    this.sellIn -= 1;
    this.quality += this.sellIn < 0 ? 2 : 1;
  }
}

export class BackstagePassItem extends GildedItem {
  update() {
    this.sellIn -= 1;

    if (this.sellIn < 0) {
      this.quality = 0;
    } else if (this.sellIn < 5) {
      this.quality += 3;
    } else if (this.sellIn < 10) {
      this.quality += 2;
    } else {
      this.quality += 1;
    }
  }
}

export class Sulfuras extends GildedItem {
  update(): void {}
}

export class ConjuredItem extends GildedItem {
  update(): void {
    this.sellIn -= 1;
    this.quality += this.sellIn < 0 ? -4 : -2;
  }
}

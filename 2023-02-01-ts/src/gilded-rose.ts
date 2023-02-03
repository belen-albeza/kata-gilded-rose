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

export enum ItemKind {
  AgedBrie = "Aged brie",
  BackstagePasses = "Backstage passes",
  Legendary = "Legendary",
  Common = "Common",
}

export function kindForItemName(name: string): ItemKind {
  if (/^aged brie$/i.test(name)) {
    return ItemKind.AgedBrie;
  }

  if (/^backstage passes/i.test(name)) {
    return ItemKind.BackstagePasses;
  }

  if (/^sulfuras([,\s]?.+|$)/i.test(name)) {
    return ItemKind.Legendary;
  }

  return ItemKind.Common;
}

function updateQualityForItem(item: Item): Item {
  let quality = item.quality;
  let sellIn = item.sellIn;

  const kind = kindForItemName(item.name);

  if (kind !== ItemKind.AgedBrie && kind !== ItemKind.BackstagePasses) {
    if (quality > 0) {
      if (kind != ItemKind.Legendary) {
        quality = quality - 1;
      }
    }
  } else {
    if (quality < 50) {
      quality = quality + 1;
      if (kind === ItemKind.BackstagePasses) {
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

  if (kind !== ItemKind.Legendary) {
    sellIn = sellIn - 1;
  }

  if (sellIn < 0) {
    if (kind !== ItemKind.AgedBrie) {
      if (kind !== ItemKind.BackstagePasses) {
        if (quality > 0) {
          if (kind !== ItemKind.Legendary) {
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

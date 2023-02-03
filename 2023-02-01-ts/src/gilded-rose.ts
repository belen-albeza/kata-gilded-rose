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
  static MAX_QUALITY = 50;
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

export function updateQualityForItem(item: Item): Item {
  const kind = kindForItemName(item.name);

  if (kind === ItemKind.Common) {
    return updateCommonItem(item);
  } else if (kind === ItemKind.AgedBrie) {
    return updateAgedBrie(item);
  }

  let quality = item.quality;
  let sellIn = item.sellIn;

  if (kind !== ItemKind.BackstagePasses) {
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

  sellIn = updateSellInForKind(sellIn, kind);

  if (sellIn < 0) {
    if (kind !== ItemKind.BackstagePasses) {
      if (quality > 0) {
        if (kind !== ItemKind.Legendary) {
          quality = quality - 1;
        }
      }
    } else {
      quality = quality - quality;
    }
  }

  return new Item(item.name, sellIn, quality);
}

function updateSellInForKind(currentSellIn: number, kind: ItemKind): number {
  return kind !== ItemKind.Legendary ? currentSellIn - 1 : currentSellIn;
}

function updateCommonItem(item: Item): Item {
  const sellIn = item.sellIn - 1;

  const qualityDelta = sellIn >= 0 ? -1 : -2;
  const quality = Math.max(0, item.quality + qualityDelta);

  return new Item(item.name, sellIn, quality);
}

function updateAgedBrie(item: Item): Item {
  const sellIn = item.sellIn - 1;

  const qualityDelta = sellIn >= 0 ? 1 : 2;
  const quality = Math.min(
    Math.max(0, item.quality + qualityDelta),
    GildedRose.MAX_QUALITY
  );

  return new Item(item.name, sellIn, quality);
}

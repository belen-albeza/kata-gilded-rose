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

  static clampQuality(quality: number): number {
    return Math.min(Math.max(0, quality), this.MAX_QUALITY);
  }
}

export enum ItemKind {
  AgedBrie = "Aged brie",
  BackstagePass = "Backstage passes",
  Legendary = "Legendary",
  Common = "Common",
  Conjured = "Conjured",
}

export function kindForItemName(name: string): ItemKind {
  if (/^aged brie$/i.test(name)) {
    return ItemKind.AgedBrie;
  }

  if (/^backstage pass(es)?/i.test(name)) {
    return ItemKind.BackstagePass;
  }

  if (/^sulfuras([,\s]?.+|$)/i.test(name)) {
    return ItemKind.Legendary;
  }

  if (/^conjured(\s.+)?/i.test(name)) {
    return ItemKind.Conjured;
  }

  return ItemKind.Common;
}

export function updateQualityForItem(item: Item): Item {
  const kind = kindForItemName(item.name);

  switch (kind) {
    case ItemKind.AgedBrie:
      return updateAgedBrieItem(item);
    case ItemKind.Legendary:
      return updateLegendaryItem(item);
    case ItemKind.BackstagePass:
      return updateBackstagePassItem(item);
    case ItemKind.Conjured:
      return updateConjuredItem(item);
    default:
      return updateCommonItem(item);
  }
}

function updateCommonItem(item: Item): Item {
  const sellIn = item.sellIn - 1;

  const qualityDelta = sellIn >= 0 ? -1 : -2;
  const quality = Math.max(0, item.quality + qualityDelta);

  return new Item(item.name, sellIn, quality);
}

function updateAgedBrieItem(item: Item): Item {
  const sellIn = item.sellIn - 1;

  const qualityDelta = sellIn >= 0 ? 1 : 2;
  const quality = GildedRose.clampQuality(item.quality + qualityDelta);

  return new Item(item.name, sellIn, quality);
}

function updateLegendaryItem(item: Item): Item {
  return new Item(item.name, item.sellIn, item.quality);
}

function updateBackstagePassItem(item: Item): Item {
  const qualityDelta = ((sellIn) => {
    switch (true) {
      case sellIn > 10:
        return 1;
      case sellIn > 5:
        return 2;
      case sellIn > 0:
        return 3;
      default:
        return -item.quality;
    }
  })(item.sellIn);

  const sellIn = item.sellIn - 1;
  const quality = GildedRose.clampQuality(item.quality + qualityDelta);

  return new Item(item.name, sellIn, quality);
}

function updateConjuredItem(item: Item): Item {
  const sellIn = item.sellIn - 1;
  const qualityDelta = sellIn >= 0 ? -2 : -4;
  const quality = GildedRose.clampQuality(item.quality + qualityDelta);

  return new Item(item.name, sellIn, quality);
}

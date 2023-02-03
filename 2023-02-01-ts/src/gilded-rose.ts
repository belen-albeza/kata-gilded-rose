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
  BackstagePass = "Backstage passes",
  Legendary = "Legendary",
  Common = "Common",
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

  return ItemKind.Common;
}

export function updateQualityForItem(item: Item): Item {
  const kind = kindForItemName(item.name);

  if (kind === ItemKind.Common) {
    return updateCommonItem(item);
  } else if (kind === ItemKind.AgedBrie) {
    return updateAgedBrieItem(item);
  } else if (kind === ItemKind.Legendary) {
    return updateLegendaryItem(item);
  } else if (kind === ItemKind.BackstagePass) {
    return updateBackstagePassItem(item);
  }

  let quality = item.quality;
  let sellIn = item.sellIn;

  if (kind !== ItemKind.BackstagePass) {
    if (quality > 0) {
      if (kind != ItemKind.Legendary) {
        quality = quality - 1;
      }
    }
  } else {
    if (quality < 50) {
      quality = quality + 1;
      if (kind === ItemKind.BackstagePass) {
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
    if (kind !== ItemKind.BackstagePass) {
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

function updateAgedBrieItem(item: Item): Item {
  const sellIn = item.sellIn - 1;

  const qualityDelta = sellIn >= 0 ? 1 : 2;
  const quality = Math.min(
    Math.max(0, item.quality + qualityDelta),
    GildedRose.MAX_QUALITY
  );

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
  const quality = Math.min(
    Math.max(0, item.quality + qualityDelta),
    GildedRose.MAX_QUALITY
  );

  return new Item(item.name, sellIn, quality);
}

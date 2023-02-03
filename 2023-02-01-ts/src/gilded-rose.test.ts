import runGoldenMaster from "./test-data/golden-master";
import { ItemKind, kindForItemName, Item, GildedRose } from "./gilded-rose";

describe("Gilded Rose golden master tests", () => {
  it("Matches the golden master after 1 day", () => {
    const goldenMaster = runGoldenMaster(1);
    expect(goldenMaster).toMatchSnapshot();
  });

  it("Matches the golden master after 2 days", () => {
    const goldenMaster = runGoldenMaster(2);
    expect(goldenMaster).toMatchSnapshot();
  });

  it("Matches the golden master after 5 days", () => {
    const goldenMaster = runGoldenMaster(5);
    expect(goldenMaster).toMatchSnapshot();
  });

  it("Matches the golden master after 10 days", () => {
    const goldenMaster = runGoldenMaster(10);
    expect(goldenMaster).toMatchSnapshot();
  });
});

describe("Item kinds", () => {
  it("Returns `AgedBrie` for aged brie", () => {
    const kind = kindForItemName("Aged Brie");
    expect(kind).toBe(ItemKind.AgedBrie);
  });

  it("Returns `BackstagePass` for concert passes", () => {
    const kind = kindForItemName("Backstage passes to a TAFKAL80ETC concert");
    expect(kind).toBe(ItemKind.BackstagePass);
  });

  it("Returns `Legendary` for Sulfuras", () => {
    const kind = kindForItemName("Sulfuras, Hand of Ragnaros");
    const altKind = kindForItemName("Sulfuras");

    expect(kind).toBe(ItemKind.Legendary);
    expect(altKind).toBe(ItemKind.Legendary);
  });
});

const anyItem = () => {
  return new Item("A sword", 5, 10);
};

const anyLegendaryItem = () => {
  return new Item("Sulfuras", 0, 80);
};

const anyCommonItem = (sellIn: number, quality: number) => {
  return new Item("A sword", sellIn, quality);
};

const anyAgedBrie = (sellIn: number, quality: number) => {
  return new Item("Aged Brie", sellIn, quality);
};

const anyBackstagePass = (sellIn: number, quality: number) => {
  return new Item("Backstage pass", sellIn, quality);
};

describe("GildedRose", () => {
  describe("Sell In values", () => {
    it("Decreases in each update", () => {
      const gildedRose = new GildedRose([anyItem()]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.sellIn).toBe(anyItem().sellIn - 1);
    });

    it("Remains constant for legendary items", () => {
      const gildedRose = new GildedRose([anyLegendaryItem()]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.sellIn).toBe(anyLegendaryItem().sellIn);
    });
  });

  describe("Quality", () => {
    it("Degrades for common items", () => {
      const gildedRose = new GildedRose([anyCommonItem(1, 4)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(3);
    });

    it("Degrades twice as fast once the sell by date has passed", () => {
      const gildedRose = new GildedRose([anyCommonItem(0, 4)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(2);
    });

    it("Never drops below zero", () => {
      const gildedRose = new GildedRose([anyCommonItem(1, 0)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(0);
    });
  });

  describe("Legendary item", () => {
    it("Never has to be sold or decreases in quality", () => {
      const gildedRose = new GildedRose([anyLegendaryItem()]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(anyLegendaryItem().quality);
      expect(item.sellIn).toBe(anyLegendaryItem().sellIn);
    });
  });

  describe("Aged Brie", () => {
    it("Increases in quality the older it gets", () => {
      const gildedRose = new GildedRose([anyAgedBrie(1, 10)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(11);
    });

    it("Increases in quality twice as fast when the sell by date has passed", () => {
      const gildedRose = new GildedRose([anyAgedBrie(0, 10)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(12);
    });

    it("Never gets updated above 50", () => {
      const gildedRose = new GildedRose([anyAgedBrie(1, 50)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(50);
    });
  });

  describe("Backstage pass", () => {
    it("Increases in quality by 1 when the concert approaches and 11+ days remain", () => {
      const gildedRose = new GildedRose([anyBackstagePass(11, 20)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(21);
    });

    it("Increases in quality by 2 when 10 or less days remain", () => {
      const gildedRose = new GildedRose([anyBackstagePass(10, 20)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(22);
    });

    it("Increases in quality by 3 when 5 or less days remain", () => {
      const gildedRose = new GildedRose([anyBackstagePass(5, 20)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(23);
    });

    it("Drops to zero quality after the concert", () => {
      const gildedRose = new GildedRose([anyBackstagePass(0, 20)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(0);
    });

    it("Never gets updated above 50 quality", () => {
      const gildedRose = new GildedRose([anyBackstagePass(5, 49)]);

      const [item, ..._] = gildedRose.updateQuality();

      expect(item.quality).toBe(50);
    });
  });
});

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

  it("Returns `BackstagePasses` for concert passes", () => {
    const kind = kindForItemName("Backstage passes to a TAFKAL80ETC concert");
    expect(kind).toBe(ItemKind.BackstagePasses);
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

describe("GildedRose", () => {
  describe("Sell In values", () => {
    it("Decreases in each update", () => {
      const gildedRose = new GildedRose([anyItem()]);

      const result = gildedRose.updateQuality();

      expect(result[0].sellIn).toBe(4);
    });

    it("Remains constant for legendary items", () => {
      const gildedRose = new GildedRose([anyLegendaryItem()]);

      const result = gildedRose.updateQuality();

      expect(result[0].sellIn).toBe(anyLegendaryItem().sellIn);
    });
  });
});

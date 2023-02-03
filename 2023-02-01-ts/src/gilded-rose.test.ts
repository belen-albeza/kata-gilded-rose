import runGoldenMaster from "./test-data/golden-master";
import { ItemKind, kindForItemName } from "./gilded-rose";

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

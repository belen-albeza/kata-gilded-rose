import { describe, it, expect } from "bun:test";

import {
  AgedItem,
  BackstagePassItem,
  CommonItem,
  Sulfuras,
  ConjuredItem,
} from "./items";

const anyQuality = 10;
const anySellIn = 100;

describe("Update items", () => {
  it("Get their sell in date and quality decreased", () => {
    const item = new CommonItem(5, 10);
    item.update();

    expect(item.sellIn).toBe(4);
    expect(item.quality).toBe(9);
  });

  it("The quality never gets below zero", () => {
    const item = new CommonItem(anySellIn, 0);
    item.update();

    expect(item.quality).toBe(0);
  });

  it("Quality degrades twice as fast for expired items", () => {
    const item = new CommonItem(0, 10);
    item.update();

    expect(item.sellIn).toBe(-1);
    expect(item.quality).toBe(8);
  });

  it("Aged items increase in quality the older they get", () => {
    const item = new AgedItem(anySellIn, 10);
    item.update();

    expect(item.quality).toBe(11);
  });

  it("Aged items keep increasing their quality after expiration", () => {
    const item = new AgedItem(-1, 10);
    item.update();

    expect(item.quality).toBe(12);
  });

  it("The quality never goes beyond 50", () => {
    const item = new AgedItem(-1, 50);
    item.update();

    expect(item.quality).toBe(50);
  });

  it("Backstage passes increase in quality when the concert is approaching", () => {
    const item = new BackstagePassItem(anySellIn, 10);
    item.update();
    expect(item.quality).toBe(11);
  });

  it("Backstage passes increase their quality by 2 the 10 days before a concert", () => {
    const item = new BackstagePassItem(10, 10);
    item.update();

    expect(item.quality).toBe(12);
  });

  it("Backstage passes increase their quality by 3 the 5 days before a concert", () => {
    const item = new BackstagePassItem(5, 10);
    item.update();

    expect(item.quality).toBe(13);
  });

  it("Backstage passes get zero quality after the concert", () => {
    const item = new BackstagePassItem(0, anyQuality);
    item.update();

    expect(item.quality).toBe(0);
  });

  it("Sulfuras never has to be sold nor decreases in quality", () => {
    const item = new Sulfuras(anySellIn, anyQuality);
    item.update();

    expect(item.quality).toBe(anyQuality);
    expect(item.sellIn).toBe(anySellIn);
  });

  it("Conjured items degrade in quality at twice the rate", () => {
    const nonExpiredItem = new ConjuredItem(anySellIn, 10);
    const expiredItem = new ConjuredItem(-1, 10);

    nonExpiredItem.update();
    expiredItem.update();

    expect(nonExpiredItem.quality).toBe(8);
    expect(expiredItem.quality).toBe(6);
  });
});

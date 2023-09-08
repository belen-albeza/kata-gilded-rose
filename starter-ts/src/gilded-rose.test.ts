import { expect, describe, it } from "vitest";

import runGoldenMaster from "./test-data/golden-master";

describe("Gilded Rose golden master tests", () => {
  it("Matches the golden master after 10 days", () => {
    const goldenMaster = runGoldenMaster(10);
    expect(goldenMaster).toMatchSnapshot();
  });
});

import runGoldenMaster from "./test-data/golden-master";

describe("Gilded Rose golden master tests", () => {
  it("Matches the golden master after 1 day", () => {
    const goldenMaster = runGoldenMaster(1);
    expect(goldenMaster).toMatchSnapshot();
  });
});

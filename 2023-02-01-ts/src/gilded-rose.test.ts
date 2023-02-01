import runGoldenMaster from "./test-data/golden-master";

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

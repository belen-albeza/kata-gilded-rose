use gildedrose_kata::run;

#[test]
fn test_golden_master_1_day() {
    let result = run(1);
    insta::assert_yaml_snapshot!(result);
}

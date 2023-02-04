use gildedrose_kata::run;

#[test]
fn test_golden_master_1_day() {
    let result = run(1);
    insta::assert_yaml_snapshot!(result);
}

#[test]
fn test_golden_master_2_days() {
    let result = run(2);
    insta::assert_yaml_snapshot!(result);
}

#[test]
fn test_golden_master_5_days() {
    let result = run(5);
    insta::assert_yaml_snapshot!(result);
}

#[test]
fn test_golden_master_10_days() {
    let result = run(10);
    insta::assert_yaml_snapshot!(result);
}

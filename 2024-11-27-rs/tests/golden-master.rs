use gildedrose::run;

#[test]
fn golden_master_no_days() {
    let items = run(0);
    insta::assert_yaml_snapshot!(items);
}

#[test]
fn golden_master_1_day() {
    let items = run(1);
    insta::assert_yaml_snapshot!(items);
}

#[test]
fn golden_master_2_days() {
    let items = run(2);
    insta::assert_yaml_snapshot!(items);
}

#[test]
fn golden_master_10_days() {
    let items = run(10);
    insta::assert_yaml_snapshot!(items);
}

#[test]
fn golden_master_30_days() {
    let items = run(30);
    insta::assert_yaml_snapshot!(items);
}

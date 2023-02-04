# 2023-02-04 Rust

Used [Insta.rs](https://insta.rs/) as the library for approval testing via snapshots. Besides the dev dependency, I also installed the recommended `cargo-insta` tool (`cargo install cargo-insta`) to manage the snapshots.

For updating the items, I created a separate type for each kind of item. Each of these types implement a common trait, `ItemUpdater`, with has an `update()` method.

To decouple the `GildedRose` type from knowing which type of items we have and which item updater to call, the enum `ItemKind` serves as a factory for types that implement `ItemUpdater`.

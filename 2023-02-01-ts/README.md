# 2023-02-01 (TypeScript)

Transformed the original `golden-master.ts` file to a function that returns a string instead of being a program that prints on the terminal so I could capture it and use **Jest**'s [`toMatchSnapshot`](https://jestjs.io/docs/snapshot-testing) for comparing the original behavior of the app (requirements are kind of fuzzy) to do [Approval testing](https://coding-is-like-cooking.info/tag/approval-testing/) with this golden master.

Introduced an enum, `ItemKind` to distinguish different item kinds. Then an util function to get a variant of this enum from an item name. It was good to be able to test this separately from the rest of the logic.

Started to tackle items logic kind by kind, starting from common items, which were the most simple. I followed a TDD approach to complement the approval testing so I could reason about the logic more easily and we have the business rules documented in code as well.

Items are processed in an immutable way, although we could have modified them in spot.

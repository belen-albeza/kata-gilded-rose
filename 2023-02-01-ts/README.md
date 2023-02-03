# 2023-02-01 (TypeScript)

Transformed the original `golden-master.ts` file to a function that returns a string instead of being a program that prints on the terminal so I could capture it and use **Jest**'s [`toMatchSnapshot`](https://jestjs.io/docs/snapshot-testing) for comparing the original behavior of the app (requirements are kind of fuzzy) to do [Approval testing](https://coding-is-like-cooking.info/tag/approval-testing/) with this golden master.

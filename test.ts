
// interface Base {
//     a: number;
// };

// // This allows any other key to be a string, excluding 'a'
// type A = Base & Omit<Record<string, string>, "a">;

// let b: A = {
//     a: 5,
//     b: "test",
// };
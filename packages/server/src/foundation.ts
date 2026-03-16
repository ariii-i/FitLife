import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type TUser = {
  id: string;
  name: string;
};

const findUser = (id: string): O.Option<TUser> =>
  id === "1" ? O.some({ id: "1", name: "Alice" }) : O.none;

// ======================================
// pattern matching
// ======================================
O.match(() => console.log("User not found"), console.log)(findUser("2"));
// =====================================

// =================================
// Extract with defaults
// =================================
const user = pipe(
  findUser("2"),
  O.getOrElse(() => ({ id: "0", name: "Guest" }))
);

console.log(user);
// =================================

// =================================
// Transformation
// =================================
const result = pipe(
  findUser("1"),
  O.map((user) => user.name)
);
console.log("result", result);
// =================================

// =================================
// Chain dependent logic (early exit)
// =================================
const isAdmin = (u: TUser): O.Option<TUser> => (u.name === "Alice" ? O.some(u) : O.none);

const result2 = pipe(findUser("1"), O.chain(isAdmin));
console.log("result2", result2);
// =================================

// =================================
// Convert to Either
// =================================

const result3 = pipe(
  findUser("2"),
  E.fromOption(() => "User not found")
);
E.match(console.log, (value) => console.log("result3", value))(result3);
// =================================

// =================================
const parseNumber = (s: string): E.Either<string, number> =>
  isNaN(Number(s)) ? E.left("Not a number") : E.right(Number(s));

E.match(console.log, console.log)(parseNumber("2"));
E.match(console.log, console.log)(parseNumber("ss"));
// =================================

// | Want to…          | Use          |
// | ----------------- | ------------ |
// | Handle both cases | `O.match`    |
// | Provide fallback  | `getOrElse`  |
// | Transform value   | `map`        |
// | Stop on missing   | `chain`      |
// | Add error         | `fromOption` |

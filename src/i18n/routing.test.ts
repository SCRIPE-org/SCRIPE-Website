import { test } from "node:test";
import assert from "node:assert/strict";
import { routing, dirFor } from "./routing";

test("locales and default", () => {
  assert.deepEqual(routing.locales, ["en", "ar"]);
  assert.equal(routing.defaultLocale, "en");
});
test("dirFor maps ar to rtl", () => {
  assert.equal(dirFor("ar"), "rtl");
  assert.equal(dirFor("en"), "ltr");
});

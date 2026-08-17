/**
 * Tiny classnames combinator for the Fusion UI primitives.
 *
 * A one-line stand-in for a library like `clsx`/`cva`: joins truthy
 * class-name fragments with a single space and drops falsy ones
 * (`undefined`, `null`, `false`, `""`). The UI primitives in this directory
 * need to merge a base class list with variant-derived lists and an
 * optional caller-supplied `className`; this task's constraints rule out
 * adding a classnames dependency for that one job, and the merge logic is
 * simple enough that it doesn't need one.
 */

/**
 * Joins class-name fragments, skipping falsy values.
 *
 * @param classes - Class-name strings to merge, or falsy values to skip
 *   (commonly a conditional expression like `isActive && "text-accent"`).
 * @returns The fragments joined with a single space.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

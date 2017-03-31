export function contains<T>(haystack: T[], needle: T, predicate: ((a: T, b: T) => boolean) = ((a,b) => a == b)): boolean {
  return haystack.reduce((found, val) => found ? predicate(needle, val) : true, false);
}
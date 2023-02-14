/*
 * workaround based on https://github.com/webpack/webpack/issues/11543
 * this will throw an `Uncaught ReferenceError: _N_E is not defined` but it works  
 */
export function Worklet(url: URL) {
  return url as unknown as string;
}
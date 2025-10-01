var isArray = Array.isArray;
/**
 *
 * @param args
 */
export function argsOrArgArray(args) {
  return args.length === 1 && isArray(args[0]) ? args[0] : args;
}
//# sourceMappingURL=argsOrArgArray.js.map

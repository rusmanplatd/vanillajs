import { from } from './from';
/**
 *
 * @param obj
 * @param scheduler
 */
export function pairs(obj, scheduler) {
  return from(Object.entries(obj), scheduler);
}
//# sourceMappingURL=pairs.js.map

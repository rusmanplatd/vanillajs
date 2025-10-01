import { combineLatest } from '../observable/combineLatest';
import { joinAllInternals } from './joinAllInternals';
/**
 *
 * @param project
 */
export function combineLatestAll(project) {
  return joinAllInternals(combineLatest, project);
}
//# sourceMappingURL=combineLatestAll.js.map

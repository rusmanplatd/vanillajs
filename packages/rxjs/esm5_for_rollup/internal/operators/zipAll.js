import { zip } from '../observable/zip';
import { joinAllInternals } from './joinAllInternals';
/**
 *
 * @param project
 */
export function zipAll(project) {
  return joinAllInternals(zip, project);
}
//# sourceMappingURL=zipAll.js.map

import { simplifyPaths } from './calc-paths/simplify-paths.js';
import { getLoopArea } from './loop/get-loop-area.js';
import { enableDebugForBooleanOp } from './debug/debug.js';
import { getPathsFromStr } from './svg/get-paths-from-str.js';
import { beziersToSvgPathStr } from './svg/beziers-to-svg-path-str.js';
import { loopFromBeziers } from './loop/loop.js';
import { getLoopCentroid } from './loop/get-loop-centroid.js';
import { sweepLine } from './sweep-line/sweep-line.js';
import { doConvexPolygonsIntersect } from './geometry/do-convex-polygons-intersect.js';
import { getIntersections } from './get-critical-points/get-intersections.js';
import { areBoxesIntersectingDd } from './sweep-line/are-boxes-intersecting.js';
export { simplifyPaths, enableDebugForBooleanOp, getLoopArea, getPathsFromStr, beziersToSvgPathStr, getLoopCentroid, loopFromBeziers, sweepLine, doConvexPolygonsIntersect, getIntersections, areBoxesIntersectingDd };
//# sourceMappingURL=index.js.map
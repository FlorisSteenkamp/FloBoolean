import { getBigBox } from '../get-big-box.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';
const assignBigBoxesToContainers = timeFunctionCalls(function assignBigBoxesToContainers(containers, expMax) {
    for (const container of containers) {
        const [[minX, minY], [maxX, maxY]] = container.box;
        const c = [(minX + maxX) / 2, (minY + maxY) / 2];
        const boxes = [
            ...container.xs.map(_x_ => _x_.next.container.box),
            ...container.xs.map(_x_ => _x_.prev.container.box),
        ];
        const bigBox = getBigBox(expMax, boxes, c);
        container.bigBox = bigBox;
    }
    return containers;
});
export { assignBigBoxesToContainers };
//# sourceMappingURL=assign-big-boxes-to-containers.js.map
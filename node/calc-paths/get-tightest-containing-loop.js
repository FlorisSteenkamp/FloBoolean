import { isLoopInLoop } from './is-loop-in-loop.js';
/**
 * @param root
 * @param loop
 */
function getTightestContainingLoop(root, loop) {
    let containingLoop = undefined;
    const stack = [root];
    while (stack.length) {
        const inOut = stack.pop();
        f(inOut);
    }
    return containingLoop;
    function f(parent) {
        if (parent === root || isLoopInLoop(loop.beziers, parent.beziers)) {
            containingLoop = parent;
            for (const child of parent.children) {
                stack.push(child);
            }
        }
    }
}
export { getTightestContainingLoop };
//# sourceMappingURL=get-tightest-containing-loop.js.map
import { sum } from './sum.js';
/**
 *
 * @param f
 */
function timeFunctionCalls(f) {
    const history = [];
    function wrapper(...args) {
        if (typeof _debug_ === 'undefined') {
            return f.apply(this, args);
        }
        const start = performance.now();
        const result = f.apply(this, args);
        const end = performance.now();
        history.push(end - start);
        return result;
    }
    ;
    // Attach a helper method to inspect stats at any time
    wrapper.getStats = () => {
        const total = sum(history);
        return {
            name: f.name,
            totalMs: total,
            count: history.length,
            // avg: history.length === 0 ? 0 : total / history.length,
            // history: history
        };
    };
    wrapper.resetStats = () => {
        history.length = 0;
    };
    return wrapper;
}
export { timeFunctionCalls };
//# sourceMappingURL=time-function-call.js.map
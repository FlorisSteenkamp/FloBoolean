import type { Container } from '../container.js';
import type { Mutable } from '../../utils/mutable.js';
import type { In, Out } from '../in-out/in-out.js';


/**
 * Simply gives each `InOut` within all containers a unique `idx`
 * 
 * @param containers 
 */
function numberInOuts(
        containers: Container[]) {

    let ioIdx = 0;
    for (const container of containers) {
        for (const inOut of container.inOuts) {
            (inOut as Mutable<In|Out>).idx = ++ioIdx;
        }
    }
}


export { numberInOuts }

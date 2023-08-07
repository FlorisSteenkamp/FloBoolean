import { Container } from "../container";


/**
 * Returns the containers that is the given containers filtered so that those
 * having only interface intersections or only a single (given as a pair) even 
 * multiple intersection are not included.
 * @param containers 
 */
function filterContainers(containers: Container[]) {
    const containers_ = containers.filter(container => {
        const xs = container.xs;
        if (container.xs.length === 2) {
            const _x_ = xs[0];
            if (_x_.x.kind === 1 && _x_.x.ri.multiplicity%2 === 0) {
                // multiple even intersection - exclude
                return false;
            }
        }

        for (const x of container.xs) {
            if (x.x.kind !== 4) { 
                // include container if any __X__ is not an interface
                return true; 
            }
        }

        return false; // exclude container
    });

    return containers_;
}


export { filterContainers }

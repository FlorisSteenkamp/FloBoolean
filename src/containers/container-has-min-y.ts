import type { Container } from "./container.js";


function containerHasMinY(
        container: Container) {

    for (let _x_ of container.xs) {
        if (_x_.x.kind === 0) {
            return true;
        }
    }

    return false;
}


export { containerHasMinY }

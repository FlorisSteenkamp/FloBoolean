import type { _X_ } from "../get-critical-points/-x-.js";


function xsHasMinY(
        xs: _X_[]) {

    for (let _x_ of xs) {
        if (_x_.x.kind === 0) {
            return true;
        }
    }

    return false;
}


export { xsHasMinY }

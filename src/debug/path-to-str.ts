import type { In, Out } from "../containers/in-out/in-out.js";


function pathToStr(
        path: (In|Out)[]): string {

    const pathStrs: string[] = [];
    for (let i=0; i<path.length; i++) {
        const inOut = path[i];

        const isOut = inOut.dir === +1;
        if (isOut) {
            pathStrs.push(`\x1b[34m${inOut.idx}\x1b[0m`);   // Out (blue)
        } else {
            pathStrs.push(`\x1b[31m${inOut.idx}\x1b[0m`);     // In (red)
        }
    }

    return pathStrs.join(' → ');
}


export { pathToStr }

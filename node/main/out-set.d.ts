import type { Out } from "../containers/in-out/in-out.js";
interface OutSetInfo {
    readonly out: Out;
    readonly depth: number;
    readonly windingNum: number;
    readonly parentWinding: number;
}
export type { OutSetInfo };

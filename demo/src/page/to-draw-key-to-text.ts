import { ToDraw } from "../state/to-draw.js"


const toDrawKeyToText: { [P in keyof ToDraw]?: string } = {
    // ------
    // Pre
    // ------
    // loopPre: 'loop pre',
    loopsPre: 'loops pre',
    boundingHull_: "hulls",
    bezier_: "bezier",

    // ------
    // Post
    // ------
    loop: "loop",
    loops: "loops",

    // ------
    // Other
    // ------
    looseBoundingBox_: "loose bbs",
    tightBoundingBox_: "tight bbs",
    container: "containers",
    intersection: "intersections",
    minY: "min y"
}


export { toDrawKeyToText }

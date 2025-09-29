import { getTotalShapeCurvature } from "./get-total-shape-curvature";

const { round, PI } = Math;


function getWindingNumber(pss: number[][][]): number {
    return round(getTotalShapeCurvature(pss)/(2*PI));
    // return getTotalShapeCurvature(pss)/(2*PI);
}


export { getWindingNumber }

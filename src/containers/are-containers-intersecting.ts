import type { Container } from "../container.js";
import { areBoxesIntersecting } from "../are-boxes-intersecting.js";


function areContainersIntersecting(container1: Container, container2: Container) {
    return areBoxesIntersecting(true, container1.box, container2.box);
}


export { areContainersIntersecting }

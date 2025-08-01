import { areBoxesIntersecting } from "../are-boxes-intersecting";
import { Container } from "../container";


function areContainersIntersecting(container1: Container, container2: Container) {
    return areBoxesIntersecting(true, container1.box, container2.box);
}


export { areContainersIntersecting }

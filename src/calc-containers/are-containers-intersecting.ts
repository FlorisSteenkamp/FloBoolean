import { areBoxesIntersecting } from "flo-bezier3";
import { Container } from "../container.js";


function areContainersIntersecting(container1: Container, container2: Container) {
    return areBoxesIntersecting(true, container1.box, container2.box);
}


export { areContainersIntersecting }


import { Container } from "../container";
import { areBoxesIntersecting } from "../sweep-line/are-boxes-intersecting";


function areContainersIntersecting(container1: Container, container2: Container) {
    return areBoxesIntersecting(true)(
        container1.box,
        container2.box
    );
}


export { areContainersIntersecting }

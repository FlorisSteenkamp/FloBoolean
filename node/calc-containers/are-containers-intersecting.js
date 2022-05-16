import { areBoxesIntersecting } from "flo-bezier3";
function areContainersIntersecting(container1, container2) {
    return areBoxesIntersecting(true, container1.box, container2.box);
}
export { areContainersIntersecting };
//# sourceMappingURL=are-containers-intersecting.js.map
import type { Container } from '../../containers/container.js';
declare function drawContainer(g: SVGGElement, container: Container, classes?: string, delay?: number, drawBigBox?: boolean): (SVGCircleElement | SVGRectElement | SVGTextElement)[];
export { drawContainer };

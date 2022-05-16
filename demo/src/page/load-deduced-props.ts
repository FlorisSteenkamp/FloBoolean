import { StateControl } from '../state-control/state-control.js';
import { getPathsFromStr, simplifyPaths } from '../../../src/index.js'
// import { vectors } from '../state/vectors';
import { updDebugGlobal } from "./upd-debug-global.js";
import { toViewBoxStr, getViewBoxForShape } from './viewbox.js';


const IS_DEBUG_ON = true;


async function loadPath(vectorName: string) {
    // const vector = vectors.find(vector => vector === vectorName);
    // const str = await (await fetch(vector.url)).text();
    const str = await (await fetch(`../test/vectors/${vectorName}.SVG`)).text();
    
    // Find an SVG element within the given URL's HTML.
    const elem = createElemFromHtml(str);
    const svgElem = findFirstSvgFromElems(elem);

    // Put the found SVG elements child nodes into our SVG
    const svgContentElems = Array.from(svgElem!.childNodes) as Node[];
    let pathStr: string;
    for (let svgContentElem of svgContentElems) {
        let pathElem = svgContentElem as SVGPathElement;
        if (pathElem.tagName === 'path') { 
            pathStr = pathElem.getAttribute('d')!;
            break; 
        }
    }

    return { pathStr: pathStr! };
}


async function loadDeducedProps(
        stateControl: StateControl,
        pathStr: string) {
        
    let bezierLoops = getPathsFromStr(pathStr);
    let viewbox = getViewBoxForShape(bezierLoops);
    let timingAll: number;
    let timeStart = performance.now();
    try {
        // Resets _debug_
        updDebugGlobal(IS_DEBUG_ON);
        let bezierLoopss = simplifyPaths(bezierLoops);
        stateControl.transientState.bezierLoopss = bezierLoopss;
    } catch (e) {
        console.log(e);
    } finally {
        timingAll = performance.now() - timeStart;
    }

    return { viewbox, timingAll };
}


function findFirstSvgFromElems(elems: NodeListOf<Node>) {
    for (let i=0; i<elems.length; i++) {
        let elem = elems[i] as SVGElement;
        if (elem.tagName === 'svg') {
            return elem;
        }
        if (typeof elem.getElementsByTagName === 'undefined') {
            continue;
        }
        let svgElems = elem.getElementsByTagName('svg');
        if (svgElems.length) {
            return svgElems[0];
        }
    }
}


function createElemFromHtml(str: string) {
    var template = document.createElement('template');
    str = str.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = str;

    return template.content.childNodes;
}


export { loadPath, loadDeducedProps }

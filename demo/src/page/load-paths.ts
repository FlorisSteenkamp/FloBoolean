

function getPaths(str: string) {
    // Find an SVG element within the given URL's HTML.
    const elem = createElemFromHtml(str);
    const svgElems = findSvgsFromElems(elem);

    const pathStrs: string[] = [];
    for (let i=0; i<svgElems.length; i++) {
        const svgElem = svgElems[i];

        // Put the found SVG elements child nodes into our SVG
        const svgContentElems = Array.from(svgElem!.childNodes) as Node[];
        let pathStr: string;
        for (const svgContentElem of svgContentElems) {
            const pathElem = svgContentElem as SVGPathElement;
            if (pathElem.tagName === 'path') { 
                pathStr = pathElem.getAttribute('d')!;
                pathStrs.push(pathStr);
            }
        }
    }

    return pathStrs;
}


// async function loadPaths(vectorName: string, forBoolean: boolean) {
async function loadPaths(vectorName: string) {
    // const path = `vectors${forBoolean ? '-boolean' : ''}/${vectorName}.SVG`;
    const path = `vectors/${vectorName}.SVG`;
    // console.log(`loading ${path}`);
    const str = await (await fetch(path)).text();
    
    return getPaths(str);
}


function findSvgsFromElems(elems: NodeListOf<Node>) {
    const svgs: SVGElement[] = [];
    for (let i=0; i<elems.length; i++) {
        const elem = elems[i] as Element;
        if (elem.tagName === 'svg') {
            svgs.push(elem as SVGElement);
        }
        svgs.push(...elem.getElementsByTagName?.('svg') || []);
    }

    return svgs;
}


function createElemFromHtml(str: string) {
    const template = document.createElement('template');
    str = str.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = str;

    return template.content.childNodes;
}


export { loadPaths, getPaths }

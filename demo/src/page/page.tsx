declare var _debug_: Debug; 

import * as React from 'react';
// import { drawFs } from 'flo-draw';
import { useRef, useEffect } from 'react';
import { Container, FormControl, InputLabel, MenuItem, Select, Grid } from '@material-ui/core';
import { StateControl } from '../state-control/state-control.js';
import { useStyles } from './styles.js';
import { Debug, IDebugElems } from '../../../src/index.js';
import { ToDraw } from '../state/to-draw.js';
import { deleteSvgs } from './delete-svgs.js';
import { Checkbox } from '../components/simple-checkbox.js';
import { vectors } from '../state/vectors.js';
import { ClickFor, PageState } from '../state/page-state.js';
import { loadDeducedProps, loadPath } from './load-deduced-props.js';
import { getViewBoxForShape, toViewBoxStr } from './viewbox.js';
import { logNearestContainer } from './log-nearest-container.js';
import { logNearestBezierPre, logLooseBb_, logTightBb_, logBHull_ } from './log-bbs.js';
import { ButtonGroup } from '../components/simple-button-group.js';
import { ValueSelect } from '../components/value-select.js';
import { inspect } from '../inspect.js';
// import { logSomeStuff } from './log-some-stuff';
import { logNearestBezierPost } from './log-nearest-bezier-post.js';
import { logNearestLoopsPost } from './log-nearest-loops-post.js';
import { logNearestLoopPost } from './log-nearest-loop-post.js';
import { logNearestLoopPre } from './log-nearest-loop-pre.js'


const toDrawCheckboxStyles = { 
	div: {
		display: 'inline-block', 
		marginBottom: '5px', 
		fontWeight: 400,
		width: '200px'
	}
}


interface Props {
	stateControl: StateControl;
	pageState: PageState;
}


const toDrawKeyToText: { [P in keyof ToDraw]?: string } = {
	// ------
	// Pre
	// ------
	boundingHull_: "hulls",
	bezier_: "Bezier",

	// ------
	// Post
	// ------
	loop: "Loop",
	loops: "Loops",	

	// ------
	// Other
	// ------
	looseBoundingBox_: "Loose bbs",
	tightBoundingBox_: "Tight bbs",
	container: "Containers",
	intersection: "Intersections",
	minY: "min y",
}


function Page(props: Props) {
	// Props
	const { stateControl, pageState } = props;
    const { state, upd, upd$, transientState } = stateControl;
    const { appState } = state;
	const { $svgs } = transientState;
	const { toDraw } = pageState;

	// Hooks
	const classes = useStyles();
	const ref = useRef<SVGSVGElement>(null);
	const refX = useRef<HTMLSpanElement>(null);
	const refY = useRef<HTMLSpanElement>(null);
	useEffect(function() { lazyLoadDeduced() }, []); // run only once
	//const [{x,y}, setXY] = useState({x: 0, y: 0});
	
	
	function mouseMove(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
		let svg$ = ref.current;
		if (!svg$) { return; }

		let { state, transientState } = stateControl;
		let { pageState } = state.appState;
		let { zoomState } = transientState;

		if (!zoomState.mouseIsDown) { return; }

		// Pixel coordinates
		let pixelsX = event.nativeEvent.offsetX;
		let pixelsY = event.nativeEvent.offsetY;
		
		let [viewboxX,viewboxY] = 
			getViewboxXY(svg$, pageState.viewbox, pixelsX, pixelsY);

		let spanX = refX.current;
		if (spanX) { spanX.innerHTML = viewboxX.toFixed(2); }
		let spanY = refY.current;
		if (spanY) { spanY.innerHTML = viewboxY.toFixed(2); }
	
		if (zoomState.zoomRect) { zoomState.zoomRect.remove(); }
		let prevViewboxXY = zoomState.prevViewboxXY!;

		let newZoomRect = [
			prevViewboxXY, 
			[viewboxX, viewboxY]
		];

		let g$ = svg$.getElementsByTagName('g')[0];
		zoomState.zoomRect = drawRect(g$, newZoomRect);

		//setXY({x,y});
	}


	function mouseDown(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
		if (event.shiftKey || event.ctrlKey || event.altKey) { return; }
		
		let svg$ = ref.current;
		if (!svg$) { return; }
		
		let ox = event.nativeEvent.offsetX;
		let oy = event.nativeEvent.offsetY;
		let viewboxXY = getViewboxXY(svg$, pageState.viewbox, ox, oy);
		
		clickedForNewViewboxFirst(stateControl, viewboxXY);
	}


	function mouseUp(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
		if (event.shiftKey || event.ctrlKey || event.altKey) { return; }

		let svg$ = ref.current;
		if (!svg$) { return; }

		let ox = event.nativeEvent.offsetX;
		let oy = event.nativeEvent.offsetY;
		let viewboxXY = getViewboxXY(svg$, pageState.viewbox, ox, oy);
		
		clickedForNewViewboxSecond(stateControl, viewboxXY);
	}


	function toDrawChanged(key: keyof ToDraw) {
		return (shouldDraw: boolean) => {
			upd(pageState.toDraw, { [key]: shouldDraw });
			drawElements(stateControl.state.appState.pageState.toDraw)
		}
	}


	async function drawElements(toDraws: ToDraw) {
        if (typeof _debug_ === 'undefined') { return; }

		let svg$ = ref.current!;
		let g = svg$.getElementsByTagName('g')[0];

		let elemss$: SVGElement[][][] = [];
        for (let elemType_ in toDraws) {
            let elemType = elemType_ as keyof IDebugElems;

            let toDraw = toDraws[elemType];

            let $elems = $svgs[elemType];
            deleteSvgs($elems);
     
            if (!toDraw) { continue; }

			let generated = _debug_.generated;
            
			if (generated.elems[elemType] === undefined) { 
				continue; 
			}
			
            for (let elem of generated.elems[elemType]) {
                let drawElem = _debug_.fs.drawElem[elemType] as (g: SVGGElement, elem: any) => SVGElement[];
                $elems.push(drawElem(g, elem));
			}
			
			elemss$.push($elems);
		}
		
		return elemss$;
	}


	async function lazyLoadDeduced() {
		let pageState: PageState;

		({ pageState } = stateControl.state.appState);
		let { vectorName } = pageState;

		let { pathStr } = await loadPath(vectorName);

		({ pageState } = stateControl.state.appState);
		upd(pageState.deduced!, { path: pathStr });

		let { viewbox, timingAll } = await loadDeducedProps(stateControl, pathStr);

		console.log(`All took: ${timingAll.toFixed(0)} milliseconds.`);

        if (typeof _debug_ !== 'undefined') {
            // logSomeStuff(timingAll);
        }

		let elems$ = drawElements(toDraw);

		({ pageState } = stateControl.state.appState);

		upd(pageState, { 
			viewbox,
			deduced: {
				path: pathStr 
			}
		});
	}


	//function vectorChanged(vectorName: string) {
	function vectorChanged(
		event: React.ChangeEvent<{
			name?: string;
			value: unknown;
		}>, child: React.ReactNode) {

		let vectorName = event.target.value as string;
		upd(pageState, { vectorName });
		lazyLoadDeduced();
	}

	function onClickForChanged(key: ClickFor | 'spacer'): void {
		if (key === 'spacer') { return; }
		upd(pageState, { clickFor: key });
	}


	function onClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
		if (event.shiftKey) { 
			gotoPrevViewbox(stateControl); 
			return;
		}

		let { state } = stateControl;
        let { pageState } = state.appState;
		const { clickFor, showDelay } = pageState;
		
		let svg$ = ref.current;
		if (!svg$) { return; }
		let g = svg$.getElementsByTagName('g')[0];

        // Pixel coordinates
        let ox = event.nativeEvent.offsetX;
        let oy = event.nativeEvent.offsetY;

		// SVG actual coordinates
		let viewboxXY = getViewboxXY(svg$, pageState.viewbox, ox, oy);
		const [x,y] = viewboxXY;

        let fs: { [T in ClickFor]: ((g: SVGGElement, p: number[], delay: number) => void) | undefined } = {
			bezier_           : logNearestBezierPre,
			loopPre           : logNearestLoopPre,

			bezier            : logNearestBezierPost,
			loopPost          : logNearestLoopPost,
			loopsPost         : logNearestLoopsPost,

			minY: undefined!,
			container         : logNearestContainer,
			// loops: undefined!,
			intersection      : undefined,
			
            looseBoundingBox_ : logLooseBb_,
            tightBoundingBox_ : logTightBb_,
            boundingHull_     : logBHull_,
            // loopset           : logNearestLoopSet,
            
        }

		const f = fs[clickFor];

		if (f === undefined) { return; }

		f(g, [x,y], showDelay);
    }


	return (<>
        <Container maxWidth="md" className={classes.container}>
			{Object
			.keys(toDraw)
			.filter(key => !!toDrawKeyToText[key as keyof ToDraw])
			.map(_key => {
				let key = _key as keyof ToDraw;
				return (
					<Checkbox 
						key={key}
						checked={toDraw[key]} 
						styles={toDrawCheckboxStyles}
						text={toDrawKeyToText[key] as string}
						onChanged={toDrawChanged(key)} 
					/>
				);
			})}
			<hr style={{ 
				display: 'block',  height: '1px', 
    			border: '0',  borderTop: '1px solid #ccc', 
    			margin: '1em 0', padding: 0, color: '#eee' }} 
			/>
			<ButtonGroup<ClickFor | 'spacer'>
				label='Click'
				styles={{ div: { display: 'inline-block', margin: '20px' } }}
				options={{
					bezier_: { text: 'bezier' },
					looseBoundingBox_: { text: 'lbb' },
					tightBoundingBox_: { text: 'tbb' },
					boundingHull_: { text: 'bh' },
					loopPre: { text: 'loop' },
					spacer: { text: '•' },
					bezier: { text: 'bezier' },
					container: { text: 'container' },
					loopPost: { text: 'loop' },
					loopsPost: { text: 'loops' },
				}}
				value={pageState.clickFor}
				onChanged={onClickForChanged}
			/>
			{/* <ValueSelect
				label="Show delay"
				styles={{}}
				value={pageState.showDelay}
				min={0}
				step={250}
				onChanged={showDelayChanged}
			/> */}
			<Grid container /*justify="flex-start"*/ spacing={5}>
				<Grid item>
					<FormControl variant="outlined" style={{ minWidth: '200px' }}>
					<InputLabel id="select-outlined-label">Shape</InputLabel>
					<Select
						labelId="select-outlined-label"
						id="select-outlined"
						value={pageState.vectorName}
						onChange={vectorChanged}
						label="Shape"
					>
						{vectors.map(v => 
							// <MenuItem key={v.name} value={v.name}>{v.name}</MenuItem>
							<MenuItem key={v} value={v}>{v}</MenuItem>
						)}
					</Select>
					</FormControl>
				</Grid>
			</Grid>
			<span ref={refX} style={{ userSelect: 'none', position: 'absolute', bottom: '13px', left: '10px' }}>
				{/*{x.toFixed(2)}*/}
			</span>
			<span ref={refY} style={{ userSelect: 'none', position: 'absolute', bottom: '13px', left: '80px' }}>
				{/*{y.toFixed(2)}*/}
			</span>
			<svg 
				ref={ref}
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				id="svg"
				x="0px" 
				y="0px"
				viewBox={toViewBoxStr(pageState.viewbox)}
				style={{ width: '100%' }}
				onMouseDown={mouseDown}
				onMouseUp={mouseUp}
				onMouseMove={mouseMove}
				onClick={onClick}
			>
				<path 
					id="svg-path"
					className="shape"
					d={pageState.deduced!.path}
				/>
				<g />
			</svg>
        </Container>
    </>);
}


function clickedForNewViewboxFirst(
		stateControl: StateControl, 
		viewboxXY: number[]) {

	let { transientState } = stateControl;
	let { zoomState } = transientState;

	// Just make sure previous rect is removed
	if (zoomState.zoomRect) { zoomState.zoomRect.remove(); }

	transientState.zoomState = { 
		mouseIsDown: true,
		prevViewboxXY: viewboxXY,
		zoomRect: undefined
	};
}


function clickedForNewViewboxSecond(
		stateControl: StateControl, 
		viewboxXY: number[]) {

	// Get info
	let { state, upd, transientState } = stateControl;
	let { pageState } = state.appState;
	let { viewbox } = pageState;
	let { zoomState } = transientState;
	let { prevViewboxXY } = zoomState;

	// Update transient info
	zoomState.mouseIsDown = false;
	if (zoomState.zoomRect) { zoomState.zoomRect.remove(); }

	// Swap if necessary
	if (viewboxXY[0] < prevViewboxXY![0]) {
		[viewboxXY[0], prevViewboxXY![0]] = [prevViewboxXY![0], viewboxXY[0]];
	}
	if (viewboxXY[1] < prevViewboxXY![1]) {
		[viewboxXY[1], prevViewboxXY![1]] = [prevViewboxXY![1], viewboxXY[1]];
	}

	let newViewbox = [prevViewboxXY!, viewboxXY];

	let viewboxW = viewbox[1][0] - viewbox[0][0];
	let viewboxH = viewbox[1][1] - viewbox[0][1];
	let newViewboxW = viewboxXY[0] - prevViewboxXY![0];
	let newViewboxH = viewboxXY[1] - prevViewboxXY![1];

	let relWidth = newViewboxW / viewboxW;
	let relHeight = newViewboxH / viewboxH;

	if (relWidth < 0.01 || relHeight < 0.01) { return; }

	transientState.viewboxStack.push(viewbox);
	upd(pageState, { viewbox: newViewbox });
}


function getViewboxXY(
		svg$: SVGSVGElement,
		viewbox: number[][], 
		pixelsX: number, 
		pixelsY: number): number[] {

	let boundingRect = svg$.getBoundingClientRect(); 
	let pixelsW = boundingRect.width;
	let pixelsH = boundingRect.height;

	let viewboxW = viewbox[1][0] - viewbox[0][0];
	let viewboxH = viewbox[1][1] - viewbox[0][1];

	let viewboxX = ((pixelsX/pixelsW) * viewboxW) + viewbox[0][0];
	let viewboxY = ((pixelsY/pixelsH) * viewboxH) + viewbox[0][1];

	return [viewboxX, viewboxY];
}


function drawRect(g: SVGGElement, rect: number[][]) {
	const XMLNS = 'http://www.w3.org/2000/svg';

	let [[x0,y0],[x1,y1]] = rect;
    let x = x0 < x1 ? x0 : x1;
    let y = y0 < y1 ? y0 : y1;
    let width = Math.abs(x0-x1);
    let height = Math.abs(y0-y1);

    let $rect = document.createElementNS(XMLNS, 'rect');
    $rect.setAttributeNS(null, "x", x.toString());
    $rect.setAttributeNS(null, "y", y.toString());
    $rect.setAttributeNS(null, "width",  width.toString());
    $rect.setAttributeNS(null, "height", height.toString());
    $rect.setAttributeNS(null, "class", 'zoomrect');

    g.appendChild($rect);

	return $rect;
}


function gotoPrevViewbox(stateControl: StateControl) {
    let { transientState, state, upd } = stateControl;
    let { pageState } = state.appState;
    let viewbox = transientState.viewboxStack.pop();
    if (!viewbox) {
        let loops = _debug_.generated.elems.loop;
        let bezierLoops = loops.map(loop => loop.beziers);
        viewbox = getViewBoxForShape(bezierLoops);
    }

    upd(pageState, { viewbox });
}


export { Page }

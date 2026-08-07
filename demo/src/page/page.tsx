import * as React from 'react';
import type { StateControl } from '../state-control/state-control.js';
import type { ToDraw } from '../state/to-draw.js';
import type { BooleanOp, PageState } from '../state/page-state.js';
import type { ClickFor } from '../state/click-for.js';
import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '../components/simple-checkbox.js';
import { vectors } from '../state/vectors.js';
import { toViewBoxStr } from './viewbox.js';
import { ButtonGroup } from '../components/simple-button-group.js';
import { SimpleSelect } from '../components/simple-select.js';
import { SimpleButton } from '../components/simple-button.js';
import { getPathsFromStr } from '../../../src/index.js';
import { drawBooleanRef } from '../../../__tests__/specific-cases/draw-boolean-ref.js';
import { onMouseUp } from './on-mouse-up.js';
import { onClick } from './on-click.js';
import { toDrawKeyToText } from './to-draw-key-to-text.js';
import { onMouseMove } from './on-mouse-move.js';
import { onMouseDown } from './on-mouse-down.js';
import { drawElements } from './draw-elements.js';
import { lazyLoadDeduced } from './lazy-load-deduced.js';


const toDrawCheckboxStyles = { 
    div: {
        display: 'inline-block', 
        marginBottom: '5px', 
        fontWeight: 400,
        width: '160px',
        textAlign: 'left' as const,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
    }
}


interface Props {
    stateControl: StateControl;
    pageState: PageState;
}


function Page(props: Props) {
    // Props
    const { stateControl, pageState } = props;
    const { upd } = stateControl;
    // const { toDraw, forBoolean } = pageState;
    const { toDraw } = pageState;

    // Hooks
    const ref = useRef<SVGSVGElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const refX = useRef<HTMLSpanElement>(null);
    const refY = useRef<HTMLSpanElement>(null);
    const [showRef, setShowRef] = useState(false);
    // useEffect(function() { lazyLoadDeduced(stateControl, ref, false, forBoolean) }, []); // run only once
    useEffect(function() { lazyLoadDeduced(stateControl, ref, false) }, []); // run only once

    // Draw (or clear) the boolean-operation reference on the overlay canvas.
    function drawReference() {
        const canvas = canvasRef.current;
        if (!canvas) { return; }
        const ctx = canvas.getContext('2d');
        if (!ctx) { return; }

        const W = canvas.width;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, W, W);
        if (!showRef) { return; }

        const pathStrs = pageState.deduced?.pathStrs;
        if (!pathStrs || pathStrs.length === 0) { return; }

        // Operand loops of the (self) boolean operation, in shape space.
        const loops = getPathsFromStr(pathStrs[0]);

        // Match the SVG's viewBox 'xMidYMid meet' mapping onto the square canvas.
        const [vx, vy] = pageState.viewbox[0];
        const vw = pageState.viewbox[1][0] - vx;
        const vh = pageState.viewbox[1][1] - vy;
        const scale = Math.min(W / vw, W / vh);
        const offX = (W - vw * scale) / 2;
        const offY = (W - vh * scale) / 2;
        const pxLoops = loops.map(loop => loop.map(bez => bez.map(
            p => [offX + (p[0] - vx) * scale, offY + (p[1] - vy) * scale]
        )));

        drawBooleanRef(ctx as any, pxLoops, pageState.booleanOp);
    }

    useEffect(drawReference, [
        showRef, pageState.booleanOp, pageState.vectorName,
        pageState.deduced, pageState.viewbox
    ]);
    
  
    function toDrawChanged(key: keyof ToDraw) {
        return (shouldDraw: boolean) => {
            upd(pageState.toDraw, { [key]: shouldDraw });
            drawElements(stateControl, ref, stateControl.state.appState.pageState.toDraw)
        }
    }


    function onVectorChanged(vectorName: string) {
        // upd(pageState, { vectorName, forBoolean: false });
        upd(pageState, { vectorName });
        // lazyLoadDeduced(stateControl, ref, true, false);
        lazyLoadDeduced(stateControl, ref, true);
    }

    function onRefreshClicked() {
        // lazyLoadDeduced(stateControl, ref, true, stateControl.state.appState.pageState.forBoolean);
        lazyLoadDeduced(stateControl, ref, true);
    }

    // FUTURE - sets of loops
    // function onVectorChangedBoolean(
    //         event: SelectChangeEvent<string>,
    //         child: React.ReactNode) {

    //     const vectorNameBoolean = event.target.value as string;
    //     upd(pageState, { vectorNameBoolean, forBoolean: true });
    //     lazyLoadDeduced(stateControl, ref, true, true);
    // }


    function onClickForChanged(clickFor: ClickFor | 'spacer'): void {
        if (clickFor === 'spacer') { return; }
        upd(pageState, { clickFor });
    }


    function onBooleanOpChanged(booleanOp: BooleanOp | 'spacer'): void {
        // FUTURE - sets of loops
        if (booleanOp === 'spacer') { return; }
        upd(pageState, { booleanOp });
        lazyLoadDeduced(stateControl, ref, true);
    }


    const { pathStrs } = pageState.deduced!;


    return (<>
        <div
            style={{
                height: '100vh',
                boxSizing: 'border-box',
                padding: '10px',
                maxWidth: '1059px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ display: 'inline-block', textAlign: 'left' }}>
                {Object
                .keys(toDraw)
                .filter(key => !!toDrawKeyToText[key as keyof ToDraw])
                .map(_key => {
                    const key = _key as keyof ToDraw;
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
                </div>
                {/* <hr style={{ 
                    display: 'block',  height: '1px', 
                    border: '0',  borderTop: '1px solid #ccc', 
                    margin: '1px 0', padding: 0, color: '#eee' }} 
                /> */}
                <br/>
                <ButtonGroup<ClickFor | 'spacer'>
                    label='Click'
                    styles={{ div: { display: 'inline-block', marginTop: '10px' } }}
                    options={{
                        loopPre: { text: 'loop pre' },
                        bezier_: { text: 'bezier' },
                        looseBoundingBox_: { text: 'lbb' },
                        tightBoundingBox_: { text: 'tbb' },
                        boundingHull_: { text: 'bh' },
                        spacer: { text: '•' },
                        bezier: { text: 'bezier' },
                        container: { text: 'container' },
                        loopPost: { text: 'loop' },
                        loopsPost: { text: 'loops' },
                        _x_: { text: '_x_' },
                    }}
                    value={pageState.clickFor}
                    onChanged={onClickForChanged}
                />
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
                    <SimpleSelect
                        label="Shape"
                        value={pageState.vectorName}
                        options={vectors}
                        onChanged={onVectorChanged}
                    />
                    <ButtonGroup<BooleanOp | 'spacer'>
                        label='Boolean Op'
                        styles={{ div: { display: 'inline-block' } }}
                        options={{
                            AND: { text: 'AND' },
                            OR: { text: 'OR' },
                            XOR: { text: 'XOR' },
                            // aNOTb: { text: 'aNOTb' },
                        }}
                        value={pageState.booleanOp}
                        onChanged={onBooleanOpChanged}
                    />
                    <SimpleButton onClick={onRefreshClicked}>
                        Refresh
                    </SimpleButton>
                    <Checkbox
                        text="Reference"
                        checked={showRef}
                        onChanged={setShowRef}
                        styles={{ div: { display: 'inline-block', userSelect: 'none' as const } }}
                    />
                </div>
            </div>
            <span ref={refX} style={{ userSelect: 'none', position: 'fixed', bottom: '13px', left: '10px', zIndex: 1 }} />
            <span ref={refY} style={{ userSelect: 'none', position: 'fixed', bottom: '13px', left: '80px', zIndex: 1 }} />
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                {pathStrs !== undefined && 
                    <div style={{ position: 'relative', width: '1024px', height: '1024px' }}>
                        <svg 
                            ref={ref}
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            id="svg"
                            x="0px" 
                            y="0px"
                            viewBox={toViewBoxStr(pageState.viewbox)}
                            style={{ userSelect: 'none', position: 'absolute', top: 0, left: 0, width: '1024px', height: '1024px' }}
                            onMouseDown={onMouseDown(stateControl, ref)}
                            onMouseUp={onMouseUp(stateControl, ref)}
                            onMouseMove={onMouseMove(stateControl, ref, refX, refY)}
                            onClick={onClick(stateControl, ref)}
                        >
                            <g />
                        </svg>
                        <canvas
                            ref={canvasRef}
                            width={1024}
                            height={1024}
                            style={{ position: 'absolute', top: 0, left: 0, width: '1024px', height: '1024px', pointerEvents: 'none' }}
                        />
                    </div>
                };
            </div>
        </div>
    </>);
}


export { Page }

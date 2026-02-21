import * as React from 'react';
import { useRef, useEffect } from 'react';
import { Container, FormControl, InputLabel, MenuItem, Select, Grid, Button } from '@mui/material';
import { StateControl } from '../state-control/state-control';
import { ToDraw } from '../state/to-draw';
import { Checkbox } from '../components/simple-checkbox';
import { vectors, vectorsBoolean } from '../state/vectors';
import { BooleanOp, ClickFor, PageState } from '../state/page-state';
import { toViewBoxStr } from './viewbox';
import { ButtonGroup } from '../components/simple-button-group';
import { SelectChangeEvent } from '@mui/material/Select';
import { onMouseUp } from './on-mouse-up';
import { onClick } from './on-click.js';
import { toDrawKeyToText } from './to-draw-key-to-text';
import { onMouseMove } from './on-mouse-move';
import { onMouseDown } from './on-mouse-down';
import { drawElements } from './draw-elements';
import { lazyLoadDeduced } from './lazy-load-deduced';


const toDrawCheckboxStyles = { 
    div: {
        display: 'inline-block', 
        marginBottom: '5px', 
        fontWeight: 400,
        width: '160px'
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
    const refX = useRef<HTMLSpanElement>(null);
    const refY = useRef<HTMLSpanElement>(null);
    // useEffect(function() { lazyLoadDeduced(stateControl, ref, false, forBoolean) }, []); // run only once
    useEffect(function() { lazyLoadDeduced(stateControl, ref, false) }, []); // run only once
    
  
    function toDrawChanged(key: keyof ToDraw) {
        return (shouldDraw: boolean) => {
            upd(pageState.toDraw, { [key]: shouldDraw });
            drawElements(stateControl, ref, stateControl.state.appState.pageState.toDraw)
        }
    }


    //function vectorChanged(vectorName: string) {
    function onVectorChanged(
            event: SelectChangeEvent<string>,
            child: React.ReactNode) {

        const vectorName = event.target.value as string;
        // upd(pageState, { vectorName, forBoolean: false });
        upd(pageState, { vectorName });
        // lazyLoadDeduced(stateControl, ref, true, false);
        lazyLoadDeduced(stateControl, ref, true);
    }

    // function onVectorSelected() {}

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
        // lazyLoadDeduced(stateControl, ref, true, true);
        lazyLoadDeduced(stateControl, ref, true);
    }


    const pathStrs = pageState.deduced!.pathStrs;


    return (<>
        <Container
            maxWidth="md"
            style={{ height: 'calc(100%)', padding: '10px' }}
        >
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
            <Grid container spacing={5}>
                <Grid>
                    <FormControl size='small' variant="outlined" style={{ minWidth: '200px', marginRight: '10px', verticalAlign: 'middle' }}>
                        <InputLabel id="select-outlined-label">Shape</InputLabel>
                        <Select
                            labelId="select-outlined-label"
                            id="select-outlined"
                            value={pageState.vectorName}
                            onChange={onVectorChanged}
                            // onSelect={onVectorSelected}
                            label="Shape"
                        >
                            {vectors.map(v => 
                                <MenuItem key={v} value={v}>{v}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    {/* <FormControl size='small' variant="outlined" style={{ minWidth: '200px', verticalAlign: 'middle' }}>
                        <InputLabel id="select-outlined-label-bool">Shapes</InputLabel>
                        <Select
                            labelId="select-outlined-label-bool"
                            id="select-outlined-bool"
                            value={pageState.vectorNameBoolean}
                            onChange={onVectorChangedBoolean}
                            label="Shapes"
                        >
                            {vectorsBoolean.map(v => 
                                <MenuItem key={v} value={v}>{v}</MenuItem>
                            )}
                        </Select>
                    </FormControl> */}
                    <ButtonGroup<BooleanOp | 'spacer'>
                        label='Boolean Op'
                        styles={{ div: { display: 'inline-block', margin: '20px', verticalAlign: 'middle' } }}
                        options={{
                            AND: { text: 'AND' },
                            OR: { text: 'OR' },
                            XOR: { text: 'XOR' },
                            // aNOTb: { text: 'aNOTb' },
                        }}
                        value={pageState.booleanOp}
                        onChanged={onBooleanOpChanged}
                    />
                    <div style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                        <Button
                            onClick={onRefreshClicked}
                        >
                            Refresh
                        </Button>
                    </div>
                </Grid>
            </Grid>
            <span ref={refX} style={{ userSelect: 'none', position: 'absolute', bottom: '13px', left: '10px' }} />
            <span ref={refY} style={{ userSelect: 'none', position: 'absolute', bottom: '13px', left: '80px' }} />
            {pathStrs !== undefined && 
                <svg 
                    ref={ref}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="svg"
                    x="0px" 
                    y="0px"
                    viewBox={toViewBoxStr(pageState.viewbox)}
                    style={{ width: '100%' }}
                    onMouseDown={onMouseDown(stateControl, ref)}
                    onMouseUp={onMouseUp(stateControl, ref)}
                    onMouseMove={onMouseMove(stateControl, ref, refX, refY)}
                    onClick={onClick(stateControl, ref)}
                >
                    {/* {pathStrs.map((pathStr,idx) => {
                        return (
                            <path 
                                key={idx}
                                id="svg-path"
                                className="shape"
                                d={pathStr}
                            />
                        )
                    })} */}
                    <g />
                </svg>
            };
        </Container>
    </>);
}


export { Page }

// 506
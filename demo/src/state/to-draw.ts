import type { DebugElems } from '../../../src/debug/debug-elems.js';


type ToDraw = { [T in keyof DebugElems]: boolean }


export type { ToDraw }

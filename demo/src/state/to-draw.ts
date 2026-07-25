import type { DebugElems } from '../../../src/debug/debug-elem-types.js';


type ToDraw = { [T in keyof DebugElems]: boolean }


export type { ToDraw }

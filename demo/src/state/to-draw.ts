import type { DebugElems } from '../../../src/debug/debug-elem-types.js';


type ToDraw = { [T in keyof (DebugElems & { _x_: any })]: boolean }


export type { ToDraw }

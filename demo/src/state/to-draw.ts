import { IDebugElems } from '../../../src/debug/debug-elem-types.js';


type ToDraw = { [T in keyof IDebugElems]: boolean }


export { ToDraw }

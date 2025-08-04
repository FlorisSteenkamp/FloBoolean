import { IDebugElems } from '../../../src/debug/debug-elem-types';


type ToDraw = { [T in keyof IDebugElems]: boolean }


export { ToDraw }

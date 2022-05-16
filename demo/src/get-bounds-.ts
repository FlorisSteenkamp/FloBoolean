import { memoize } from 'flo-memoize';
import { getBounds } from 'flo-bezier3';


const getBounds_ = memoize(getBounds);


export { getBounds_ }

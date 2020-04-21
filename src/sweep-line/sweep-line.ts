
type IntersectionResult<T,U> = {
    /** the first item checked for possible intersection */
    a: T;
    /** the second item checked for possible intersection */
    b: T;
    /** the result of the predicate */
    u: U;
}


type LEFT  = -1;
type RIGHT =  1;


/** 
 * Represents an event
 */
interface IEvent<T> {
    /** type - 0 -> left side, 1 -> right side */
    type: LEFT|RIGHT;

    /** The item */
    item: T;

    /** A point. */
    x: number;
}


const EVENT_LEFT  : LEFT  = -1;
const EVENT_RIGHT : RIGHT = +1;


/**
 * Generalized sweepline algorithm.
 * 
 * Typically used to turn O(n^2) algorithms into roughly O(n logn) algorithms.
 * 
 * @param items An array of items that are to be compared. Items should 
 * typically be geometric objects in 2d space with well-defined left and right
 * endpoints.
 * @param getLeftmostPoint A function that returns the leftmost point of the
 * geometric object of interest.
 * @param getRightmostPoint A function that returns the rightmost point of the
 * geometric object of interest.
 * @param predicate A predicate that takes two geometric objects and returns
 * truthy (of some specific type) if they are of interest or falsey otherwise.
 */ 
function sweepLine<T,U>(
        items: T[], 
        getLeftmost: (item: T) => number,
        getRightmost: (item: T) => number,
        predicate: (item1: T, item2: T) => U): IntersectionResult<T,U>[] {

    // Initialize event queue to contain all endpoints.
    let events: IEvent<T>[] = [];
	for (let item of items) {
		events.push({ 
            type: EVENT_LEFT, 
            item, 
            x: getLeftmost(item)
        });
		events.push({ 
            type: EVENT_RIGHT, 
            item, 
            x: getRightmost(item)
        });
	}

	events.sort(compare);
	
	let activeItems = new Set<T>();
    
    /** A list of pairs of items that passed the predicate */
	let pairedItems: IntersectionResult<T,U>[] = [];
	for (let event of events) {
    	let item = event.item;
    	
   		if (event.type === EVENT_LEFT) {
   			for (let activeItem of activeItems.values()) {
                //(window as any).ii++;
                let result = predicate(item, activeItem);
   				if (result) { 
                    //(window as any).jj++;
                    //console.log(result)
                    pairedItems.push({ 
                        a: item, 
                        b: activeItem, 
                        u: result 
                    });
   				}
   			}

   			activeItems.add(item);
   		} else if (event.type === EVENT_RIGHT) {
   			activeItems.delete(event.item);
   		}
	}
	
	return pairedItems;
}


/**
 * Compare two Events by their x-axis and then by their type.
 * @param a An event
 * @param b Another event
 */
function compare<T>(a: IEvent<T>, b: IEvent<T>) {
    let res = a.x - b.x;

    if (res !== 0) { return res; }

    // Alwys put left events before right ones.
    return a.type;
}


export { sweepLine, IntersectionResult }

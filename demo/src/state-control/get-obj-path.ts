
function getObjPath(o: { [key:string]: any }, v: any): string[] | undefined {
    for (let k in o) {
        if (o[k] === v) {
            return [k];
        }
        if (typeof o[k] === "object") {
            let path = getObjPath(o[k], v);
            if (path) {
                path.unshift(k);
                
                return path;
            }
        }
    }
}


export { getObjPath }

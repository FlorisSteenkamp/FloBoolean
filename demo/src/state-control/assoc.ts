
function assoc(key: string, v: any, o: { [key:string]: any }) {
    let no: { [key:string]: any } = {};
    for (let k in o) {
        no[k] = o[k]
    }

    no[key] = v;
    return no;
}


export { assoc }

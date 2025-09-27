// import { InOut } from "../containers/in-out/in-out";
// import { orderInOuts } from "../containers/order-in-outs";


// function gotoNextContainer(
//         initialOut: InOut) {

//     let next = initialOut.nextOrPrev!;
//     const initialContainer = initialOut.container;

//     orderInOuts(next.container, 1);

//     // note: inOuts.length === 2
//     const [inOut1, inOut2] = initialContainer.inOuts;

//     while (true) {
//         next = initialOut.dir === +1
//             ? next.prevAround!
//             : next.nextAround!

//         if (next.dir === +1) {
//             //---------------------
//             // remove minY `InOut`
//             //---------------------
//             const other1 = inOut1.nextOrPrev!;
//             const other2 = inOut2.nextOrPrev!;
//             console.log(other1);
//             console.log(other2);

//             //-----------
//             // reconnect
//             //-----------
//             // @ts-ignore
//             // other1.nextOrPrev = other2?.nextOrPrev;
//             // // @ts-ignore
//             // other2.nextOrPrev = other1?.nextOrPrev;
//             // // @ts-ignore
//             // other2.idx = other1.idx;


//             //---------------
//             // update props
//             //---------------
//             // @ts-ignore
//             next.orientation = initialOut.orientation;
//             // @ts-ignore
//             next.parent = initialOut.parent;
//             // @ts-ignore
//             next.windingNum = initialOut.windingNum;
//             // @ts-ignore
//             next.loopsIdxs = initialOut.loopsIdxs;

//             break;
//         }
//     }

//     // @ts-ignore
//     next.children = new Set();

//     // return next;
//     return initialOut;
// }


// export { gotoNextContainer }

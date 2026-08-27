// import type { InOut } from "../containers/in-out/in-out.js";


// /**
//  * Returns all children, including the root.
//  * 
//  * @param root 
//  */

// function getAllLoopsFromTree(
//         root: In|Out): InOut[] {

//     const all = [root];

//     const stack = Array.from(root.children!);
//     while (stack.length) {
//         const tree = stack.pop()!;

//         all.push(tree);

//         for (const child of tree.children!) {
//             stack.push(child);
//         }
//     }

//     return all;
// }


// export { getAllLoopsFromTree }

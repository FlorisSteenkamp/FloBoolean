
test('getTotalShapeCurvature', function() {
    // TODO
});

// Quokka tests
// {
//     //----------------
//     // Some rectangle
//     //----------------
//     const pss = [
//         [[0,0], [0,8]],
//         [[0,8], [1,8]],
//         [[1,8], [1,0]],
//         [[1,0], [0,0]]
//     ];
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }


// {
//     //-------------
//     // Unit circle
//     //-------------
//     const C = 0.5519150244935105707435627

//     const pss = ([
//         [[0,1], [C,1], [1,C], [1,0]],  // quarter circle
//         [[1,0], [1,-C], [C,-1], [0,-1]],
//         [[0,-1], [-C,-1], [-1,-C], [-1,0]],
//         [[-1,0], [-1,C], [-C,1], [0,1]],
//     ]);
    
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }

// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const C = 0.5519150244935105707435627

//     const pss = ([
//         [[0,1], [C/3,1], [1/3,C], [1/3,0]],  // quarter circle
//         [[1/3,0], [1/3,-C], [C/3,-1], [0,-1]],
//         [[0,-1], [-C/3,-1], [-1/3,-C], [-1/3,0]],
//         [[-1/3,0], [-1/3,C], [-C/3,1], [0,1]],
//     ]);
    
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }

// {
//     //--------
//     // Square
//     //--------
//     const pss: number[][][] = ([
//         [[0,0], [0,1]],
//         [[0,1], [1,1]],
//         [[1,1], [1,0]],
//         [[1,0], [0,0]]
//     ]);

//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }
import { test, expect } from '@jest/globals';
import { parsePathDataString } from '../../src/svg/path-data-polyfill/parse-path-data-string.ts';


/**
 * One string exercising every command (absolute + relative), a leading run of
 * mixed whitespace, exponent numbers (`1e+2`, `2E1`, `1.5e1`, `2e-1`), a
 * leading-dot number (`.5`), comma vs space delimiters, sign-as-delimiter
 * (`l-2-3`), an implicit command (`M ... x y x y` -> the 2nd pair is an implicit
 * `L`), and close-path normalization (both `z` and `Z` -> `"Z"`).
 */
test('parsePathDataString - every command, whitespace, exponents, implicit commands', () => {
    const d =
        '  \t\r\n' +               // leading whitespace: space, tab, CR, LF
        'M 0,0 10,10 ' +           // moveto + implicit lineto (M -> L) -> [10,10]
        'L 1e+2 2E1 -3 -4 ' +     // explicit lineto, exponents [100,20] + implicit repeat L [-3,-4]
        'H .5 ' +                  // horizontal, leading-dot number -> [0.5]
        'V -4 ' +                  // vertical, negative
        'C 0 0 1 1 2 2 ' +         // cubic bezier
        'S 3,3 4,4 ' +             // smooth cubic, comma delimiters
        'Q 5 5 6 6 ' +             // quadratic bezier
        'T 7 7 ' +                 // smooth quadratic
        'A 1 2 30 0 1 8 8 ' +      // elliptical arc (rx ry rot large sweep x y)
        'Z ' +                     // close
        'm 1 1 2 2 ' +             // relative moveto + implicit relative lineto (m -> l) -> [2,2]
        'l-2-3 ' +                 // relative lineto, sign-as-delimiter -> [-2,-3]
        'h 1.5e1 ' +               // relative horizontal -> [15]
        'v 2e-1 ' +                // relative vertical -> [0.2]
        'c 0 0 1 1 2 2 ' +         // relative cubic
        's 3 3 4 4 ' +             // relative smooth cubic
        'q 5 5 6 6 ' +             // relative quadratic
        't 7 7 ' +                 // relative smooth quadratic
        'a 1 2 30 1 0 8 8 ' +      // relative arc
        'z';                       // relative close (normalizes to "Z")

    const segments = parsePathDataString(d);

    expect(segments).toEqual([
        { command: 'M', values: [0, 0] },
        { command: 'L', values: [10, 10] },          // implicit (M -> L)
        { command: 'L', values: [100, 20] },         // 1e+2, 2E1
        { command: 'L', values: [-3, -4] },          // implicit repeat of previous command (else branch)
        { command: 'H', values: [0.5] },             // .5
        { command: 'V', values: [-4] },
        { command: 'C', values: [0, 0, 1, 1, 2, 2] },
        { command: 'S', values: [3, 3, 4, 4] },
        { command: 'Q', values: [5, 5, 6, 6] },
        { command: 'T', values: [7, 7] },
        { command: 'A', values: [1, 2, 30, 0, 1, 8, 8] },
        { command: 'Z', values: [] },
        { command: 'm', values: [1, 1] },
        { command: 'l', values: [2, 2] },            // implicit (m -> l)
        { command: 'l', values: [-2, -3] },          // l-2-3
        { command: 'h', values: [15] },              // 1.5e1
        { command: 'v', values: [0.2] },             // 2e-1
        { command: 'c', values: [0, 0, 1, 1, 2, 2] },
        { command: 's', values: [3, 3, 4, 4] },
        { command: 'q', values: [5, 5, 6, 6] },
        { command: 't', values: [7, 7] },
        { command: 'a', values: [1, 2, 30, 1, 0, 8, 8] },
        { command: 'Z', values: [] },                // z normalizes to "Z"
    ]);

    // Implicit-command error path: a coordinate following a close-path (Z) has
    // no command to continue (Z takes no coordinates), so parsing must throw.
    expect(() => parsePathDataString('M 0 0 Z 5 5'))
        .toThrow('Remaining coordinates not found for implicit command');
});


test('parsePathDataString - whitespace-only path yields no segments', () => {
    expect(parsePathDataString('  \t\r\n ')).toEqual([]);
});


test('parsePathDataString - throws when an arc is truncated before a flag', () => {
    expect(() => parsePathDataString('M 0 0 A 1 1 0'))
        .toThrow('Unable to parse arc flag');
});


test('parsePathDataString - throws when an arc flag is not 0 or 1', () => {
    expect(() => parsePathDataString('M 0 0 A 1 1 0 2 0 8 8'))
        .toThrow('arc flag must be 0 or 1');
});


test('parsePathDataString - accepts a leading lowercase moveto', () => {
    expect(parsePathDataString('m 1 2 3 4')).toEqual([
        { command: 'm', values: [1, 2] },
        { command: 'l', values: [3, 4] },   // implicit (m -> l)
    ]);
});


test('parsePathDataString - throws when not starting with a moveto', () => {
    expect(() => parsePathDataString('L 0 0'))
        .toThrow('Path must start with m or M');
});


test('parsePathDataString - throws when a decimal point has no following digit', () => {
    expect(() => parsePathDataString('M 1. 0'))
        .toThrow('There must be a least one digit following the .');
});


test('parsePathDataString - throws when an exponent has no digits', () => {
    expect(() => parsePathDataString('M 1e 0'))
        .toThrow('There must be an exponent.');
});



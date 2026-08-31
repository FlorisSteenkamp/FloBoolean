import { skipOptionalSpaces } from './skip-optional-spaces.js';
import { skipOptionalSpacesOrDelimiter } from './skip-optional-spaces-or-delimiter.js';
/**
 * Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
 * Source/core/svg/SVGParserUtilities.cpp.
 * Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
 *
 * @param source
 *
 * @internal
 */
function parseNumber(source) {
    let exponent = 0;
    let integer = 0;
    let frac = 1;
    let decimal = 0;
    let sign = 1;
    let expsign = 1;
    const startIndex = source._currentIndex;
    skipOptionalSpaces(source);
    let ci = source._currentIndex;
    // Read the sign.
    if (ci < source._endIndex && source._string[ci] === "+") {
        source._currentIndex++;
        ci++;
    }
    else if (ci < source._endIndex && source._string[ci] === "-") {
        source._currentIndex++;
        ci++;
        sign = -1;
    }
    const c = source._string[ci];
    if (ci === source._endIndex ||
        ((c < "0" || c > "9") && c !== ".")) {
        throw new Error(`The first character of a number must be one of [0-9+-.]. Found '${c}' at index ${ci}.`);
    }
    // Read the integer part, build right-to-left.
    const startIntPartIndex = source._currentIndex;
    while (ci < source._endIndex &&
        source._string[ci] >= "0" &&
        source._string[ci] <= "9") {
        // Advance to first non-digit.
        source._currentIndex++;
        ci++;
    }
    if (ci !== startIntPartIndex) {
        let scanIntPartIndex = ci - 1;
        let multiplier = 1;
        while (scanIntPartIndex >= startIntPartIndex) {
            integer += multiplier * (Number(source._string[scanIntPartIndex]) - 0);
            scanIntPartIndex -= 1;
            multiplier *= 10;
        }
    }
    // Read the decimals.
    if (ci < source._endIndex && source._string[ci] === ".") {
        source._currentIndex++;
        ci++;
        if (ci >= source._endIndex ||
            source._string[ci] < "0" ||
            source._string[ci] > "9") {
            throw new Error('There must be a least one digit following the .');
        }
        while (ci < source._endIndex &&
            source._string[ci] >= "0" &&
            source._string[ci] <= "9") {
            frac *= 10;
            decimal += (Number(source._string[ci])) / frac;
            source._currentIndex++;
            ci++;
        }
    }
    // Read the exponent part.
    if (ci !== startIndex &&
        ci + 1 < source._endIndex &&
        (source._string[ci] === "e" || source._string[ci] === "E") &&
        (source._string[ci + 1] !== "x" && source._string[ci + 1] !== "m")) {
        source._currentIndex++;
        ci++;
        // Read the sign of the exponent.
        if (source._string[ci] === "+") {
            source._currentIndex++;
            ci++;
        }
        else if (source._string[ci] === "-") {
            source._currentIndex++;
            ci++;
            expsign = -1;
        }
        if (ci >= source._endIndex ||
            source._string[ci] < "0" ||
            source._string[ci] > "9") {
            throw new Error('There must be an exponent.');
        }
        while (ci < source._endIndex &&
            source._string[ci] >= "0" &&
            source._string[ci] <= "9") {
            exponent *= 10;
            exponent += (Number(source._string[ci]));
            source._currentIndex++;
            ci++;
        }
    }
    let number = integer + decimal;
    number *= sign;
    if (exponent) {
        number *= 10 ** (expsign * exponent);
    }
    skipOptionalSpacesOrDelimiter(source);
    return number;
}
export { parseNumber };
//# sourceMappingURL=parse-number.js.map
import { Source } from './source.js';


/**
 * @hidden
 * Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
 * Source/core/svg/SVGParserUtilities.cpp.
 * Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
 * @param source 
 */
function parseNumber(source: Source): number {
    let exponent   = 0;
    let integer    = 0;
    let frac       = 1;
    let decimal    = 0;
    let sign       = 1;
    let expsign    = 1;
    const startIndex = source._currentIndex;

    source._skipOptionalSpaces();

    // Read the sign.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "+") {
        source._currentIndex += 1;
    } else if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "-") {
        source._currentIndex += 1;
        sign = -1;
    }

    if (
        source._currentIndex === source._endIndex ||
        (
            (source._string[source._currentIndex] < "0" || source._string[source._currentIndex] > "9") &&
            source._string[source._currentIndex] !== "."
        )
    ) {
        throw new Error('The first character of a number must be one of [0-9+-.].');
    }

    // Read the integer part, build right-to-left.
    const startIntPartIndex = source._currentIndex;

    while (
        source._currentIndex < source._endIndex &&
        source._string[source._currentIndex] >= "0" &&
        source._string[source._currentIndex] <= "9"
    ) {
        source._currentIndex += 1; // Advance to first non-digit.
    }

    if (source._currentIndex !== startIntPartIndex) {
        let scanIntPartIndex = source._currentIndex - 1;
        let multiplier = 1;

        while (scanIntPartIndex >= startIntPartIndex) {
            integer += multiplier * (Number(source._string[scanIntPartIndex]) - 0);
            scanIntPartIndex -= 1;
            multiplier *= 10;
        }
    }

    // Read the decimals.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === ".") {
        source._currentIndex += 1;

        if (
            source._currentIndex >= source._endIndex ||
            source._string[source._currentIndex] < "0" ||
            source._string[source._currentIndex] > "9"
        ) {
            throw new Error('There must be a least one digit following the .')
        }

        while (
            source._currentIndex < source._endIndex &&
            source._string[source._currentIndex] >= "0" &&
            source._string[source._currentIndex] <= "9"
        ) {
            frac *= 10;
            decimal += (Number(source._string.charAt(source._currentIndex))) / frac;
            source._currentIndex += 1;
        }
    }

    // Read the exponent part.
    if (
        source._currentIndex !== startIndex &&
        source._currentIndex + 1 < source._endIndex &&
        (source._string[source._currentIndex] === "e" || source._string[source._currentIndex] === "E") &&
        (source._string[source._currentIndex + 1] !== "x" && source._string[source._currentIndex + 1] !== "m")
    ) {
        source._currentIndex += 1;

        // Read the sign of the exponent.
        if (source._string[source._currentIndex] === "+") {
            source._currentIndex += 1;
        } else if (source._string[source._currentIndex] === "-") {
            source._currentIndex += 1;
            expsign = -1;
        }

        if (
            source._currentIndex >= source._endIndex ||
            source._string[source._currentIndex] < "0" ||
            source._string[source._currentIndex] > "9"
        ) {
            throw new Error('There must be an exponent.')
        }

        while (
            source._currentIndex < source._endIndex &&
            source._string[source._currentIndex] >= "0" &&
            source._string[source._currentIndex] <= "9"
        ) {
            exponent *= 10;
            exponent += (Number(source._string[source._currentIndex]));
            source._currentIndex += 1;
        }
    }

    let number = integer + decimal;
    number *= sign;

    if (exponent) {
        number *= Math.pow(10, expsign * exponent);
    }

    if (startIndex === source._currentIndex) {
        throw new Error('Internal error: startIndex === source._currentIndex');
    }

    source._skipOptionalSpacesOrDelimiter();

    return number;
}


export { parseNumber }

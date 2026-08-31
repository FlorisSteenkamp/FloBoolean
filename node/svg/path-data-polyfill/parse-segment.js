import { toCommand } from './to-command.js';
import { parseNumber } from './parse-number.js';
import { parseArcFlag } from './parse-arc-flag.js';
import { skipOptionalSpaces } from './skip-optional-spaces.js';
function parseSegment(source) {
    const char = source._string[source._currentIndex];
    let command = toCommand(char);
    if (command === undefined) {
        // Check for remaining coordinates in the current command.
        if ((char === "+" || char === "-" || char === "." || (char >= "0" && char <= "9")) &&
            source._prevCommand !== "Z") {
            if (source._prevCommand === "M") {
                command = "L";
            }
            else if (source._prevCommand === "m") {
                command = "l";
            }
            else {
                // Reached only on implicit repeats of a prior command, so
                // _prevCommand is always defined here.
                command = source._prevCommand;
            }
        }
        else {
            throw new Error('Remaining coordinates not found for implicit command');
        }
    }
    else {
        source._currentIndex++;
    }
    source._prevCommand = command;
    const cmd = command.toUpperCase();
    let values;
    if (cmd === "H" || cmd === "V") {
        values = [parseNumber(source)];
    }
    else if (cmd === "M" || cmd === "L" || cmd === "T") {
        values = [
            parseNumber(source),
            parseNumber(source)
        ];
    }
    else if (cmd === "S" || cmd === "Q") {
        values = [
            parseNumber(source),
            parseNumber(source),
            parseNumber(source),
            parseNumber(source)
        ];
    }
    else if (cmd === "C") {
        values = [
            parseNumber(source),
            parseNumber(source),
            parseNumber(source),
            parseNumber(source),
            parseNumber(source),
            parseNumber(source)
        ];
    }
    else if (cmd === "A") {
        values = [
            parseNumber(source),
            parseNumber(source),
            parseNumber(source),
            parseArcFlag(source),
            parseArcFlag(source),
            parseNumber(source),
            parseNumber(source)
        ];
    }
    else {
        // The only remaining valid command is Z (close-path), which takes no
        // coordinates. `toCommand` guarantees `cmd` is one of the handled
        // commands, so no "unknown command" case is possible here.
        skipOptionalSpaces(source);
        values = [];
    }
    return { command: command, values };
}
export { parseSegment };
//# sourceMappingURL=parse-segment.js.map
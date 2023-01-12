import { parseNumber } from './parse-number.js';


/** @hidden */
const COMMAND_MAP: { [index:string]: string } = {
    Z:"Z", M:"M", L:"L", C:"C", Q:"Q", A:"A", H:"H", V:"V", S:"S", T:"T",
    z:"Z", m:"m", l:"l", c:"c", q:"q", a:"a", h:"h", v:"v", s:"s", t:"t"
};


/** @hidden */
class Source {
    _string: string;
    _currentIndex: number;
    _endIndex: number;
    _prevCommand: string | undefined;


    constructor(string: string) {
        this._string = string;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._prevCommand = undefined;
        this._skipOptionalSpaces();
    }

    
    parseSegment(): { type: string, values: number[] } {
        const char = this._string[this._currentIndex];
        let command = COMMAND_MAP[char];

        if (command === undefined) {
            if (this._prevCommand === undefined) {
                throw new Error('Implicit command not allowed for first commands.')
            }

            // Check for remaining coordinates in the current command.
            if ((char === "+" || char === "-" || char === "." || (char >= "0" && char <= "9")) && 
                this._prevCommand !== "Z") {

                if (this._prevCommand === "M") {
                    command = "L";
                } else if (this._prevCommand === "m") {
                    command = "l";
                } else {
                    command = this._prevCommand;
                }
            } else {
                throw new Error('Remaining coordinates not found for implicit command');
            }
        } else {
            this._currentIndex += 1;
        }

        this._prevCommand = command;

        let values: number[] | undefined = undefined;
        const cmd = command.toUpperCase();

        if (cmd === "H" || cmd === "V") {
            values = [parseNumber(this)];
        } else if (cmd === "M" || cmd === "L" || cmd === "T") {
            values = [parseNumber(this), parseNumber(this)];
        } else if (cmd === "S" || cmd === "Q") {
            values = [parseNumber(this), parseNumber(this), parseNumber(this), parseNumber(this)];
        } else if (cmd === "C") {
            values = [
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this)
            ];
        } else if (cmd === "A") {
            values = [
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                this._parseArcFlag(),
                this._parseArcFlag(),
                parseNumber(this),
                parseNumber(this)
            ];
        } else if (cmd === "Z") {
            this._skipOptionalSpaces();
            values = [];
        }

        if (values === undefined) {
            throw new Error('Unknown command')
        } else {
            return { type: command, values };
        }          
    }


    hasMoreData(): boolean {
        return this._currentIndex < this._endIndex;
    }


    initialCommandIsMoveTo(): boolean {
        // If the path is empty it is still valid, so return true.
        if (!this.hasMoreData()) {
            return true;
        }

        const command = COMMAND_MAP[this._string[this._currentIndex]];

        return command === "M" || command === "m";
    }


    _isCurrentSpace(): boolean {
        const char = this._string[this._currentIndex];
        return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
    }


    _skipOptionalSpaces(): boolean {
        while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
            this._currentIndex += 1;
        }

        return this._currentIndex < this._endIndex;
    }


    _skipOptionalSpacesOrDelimiter(): boolean {
        if (
            this._currentIndex < this._endIndex &&
            !this._isCurrentSpace() &&
            this._string[this._currentIndex] !== ","
        ) {
            return false;
        }

        if (this._skipOptionalSpaces()) {
            if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ",") {
                this._currentIndex += 1;
                this._skipOptionalSpaces();
            }
        }

        return this._currentIndex < this._endIndex;
    }


    _parseArcFlag(): number {
        if (this._currentIndex >= this._endIndex) {
            throw new Error('Unable to parse arc flag');
        }

        let flag: number | undefined = undefined;
        const flagChar = this._string[this._currentIndex];

        this._currentIndex += 1;

        if (flagChar === "0") {
            flag = 0;
        } else if (flagChar === "1") {
            flag = 1;
        } else {
            throw new Error('Unable to parse arc flag - arc flag must be 0 or 1');
        }

        this._skipOptionalSpacesOrDelimiter();

        return flag;
    }
}


export { Source }
 
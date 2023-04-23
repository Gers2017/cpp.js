import { readFileSync, writeFileSync } from "fs";
import { Parser } from "./parser.js";
import { PrintStmt, ReturnStmt } from "./stuff.js";
import {
    is_alpha,
    is_alphanum,
    is_digit,
    is_whitespace,
    pretty_error,
    panic,
} from "./utils.js";

// Javascript enums at home
export const TokenType = {
    LEFT_PAREN: 1,
    RIGHT_PAREN: 2,
    LEFT_BRACE: 3,
    RIGHT_BRACE: 4,
    SEMICOLON: 5,
    COMMA: 6,
    IDENTIFIER: 7,
    STRING: 8,
    NUMBER: 9,
    PRINTF: 10,
    RETURN: 11,
    IF: 12,
    ELSE: 13,
    INT_TYPE: 14,
    EOF: 15,
};

const LITERAL_TOKENS = {
    "(": TokenType.LEFT_PAREN,
    ")": TokenType.RIGHT_PAREN,
    "{": TokenType.LEFT_BRACE,
    "}": TokenType.RIGHT_BRACE,
    ",": TokenType.COMMA,
    ";": TokenType.SEMICOLON,
};

const KEYWORDS = {
    printf: TokenType.PRINTF,
    int: TokenType.INT_TYPE,
    return: TokenType.RETURN,
    if: TokenType.IF,
    else: TokenType.ELSE,
};

export class Token {
    /**
     * @param {number} token_type
     * @param {string} value
     * @param {Location} loc
     */
    constructor(token_type, value, loc) {
        this.token_type = token_type;
        this.value = value;
        this.loc = loc;
    }

    display() {
        return `Token { type: ${this.token_type}, value: '${
            this.value
        }', location: ${this.loc.display()} }`;
    }
}

export class Location {
    /**
     * @param { number } row
     * @param { number } column
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    display() {
        // human readable
        return `(row: ${this.row + 1}, col: ${this.column + 1})`;
    }
}

// ------- Lexer --------

class Lexer {
    /**
     * @param {string} source
     */
    constructor(source) {
        this.source = source;
        this.index = 0;
        this.cursor = 0; // index at the start of new scan
        this.row = 0;
        this.line_start = 0;
        /** @type {Token[]} */
        this.tokens = [];
    }

    length() {
        return this.source.length;
    }

    is_end() {
        return this.index >= this.length();
    }

    is_not_end() {
        return this.index < this.length();
    }

    advance() {
        if (this.is_not_end()) {
            let ch = this.peek();
            this.index++;

            if (ch === "\n") {
                this.line_start = this.index;
                this.row++;
            }
        }
    }

    get_column() {
        return this.index - this.line_start;
    }

    get_location() {
        return new Location(this.row, this.get_column());
    }

    peek() {
        return this.source[this.index];
    }

    /**
     * @returns { string | null }
     */
    peek_next() {
        if (this.index + 1 >= this.length()) {
            return null;
        }

        return this.source[this.index + 1];
    }

    matches(ch) {
        return this.peek() === ch;
    }

    next_matches(ch) {
        let next = this.peek_next();
        if (next === null) return false;
        return next === ch;
    }

    /**
     * @param { (ch: string) => boolean } predicate
     */
    drop_while(predicate) {
        while (this.is_not_end() && predicate(this.peek())) {
            this.advance(); // skip ch
        }
    }

    trim_left() {
        this.drop_while((ch) => is_whitespace(ch));
    }

    drop_line() {
        this.drop_while((ch) => ch !== "\n");
        if (this.is_not_end()) {
            this.advance();
        }
    }

    scan_tokens() {
        while (this.is_not_end()) {
            this.cursor = this.index;
            this.scan_token();
        }

        this.push_token(new Token(TokenType.EOF, "", this.get_location()));
        return this.tokens;
    }

    scan_token() {
        const ch = this.peek();
        const location = this.get_location();

        if (is_whitespace(ch)) {
            this.advance();
            return;
        }

        if (
            this.matches("#") ||
            (this.matches("/") && this.next_matches("/"))
        ) {
            this.drop_line();
            return;
        }

        switch (ch) {
            case '"':
                this.string(location);
                break;
            default:
                if (ch in LITERAL_TOKENS) {
                    this.push_token(
                        new Token(LITERAL_TOKENS[ch], ch, location)
                    );
                    this.advance();
                } else if (is_alpha(ch)) {
                    this.identifier(location);
                } else if (is_digit(ch)) {
                    this.digit(location);
                } else {
                    panic(`Lexer error: Unknown token '${ch}'`);
                }
                break;
        }
    }

    push_token(token) {
        this.tokens.push(token);
    }

    slice(start) {
        if (!start) {
            start = this.cursor;
        }
        return this.source.slice(start, this.index);
    }

    identifier(location) {
        while (this.is_not_end() && is_alphanum(this.peek())) {
            this.advance();
        }

        const value = this.slice();
        const type = value in KEYWORDS ? KEYWORDS[value] : TokenType.IDENTIFIER;
        this.push_token(new Token(type, value, location));
    }

    digit(location) {
        while (this.is_not_end() && is_digit(this.peek())) {
            this.advance();
        }

        const value = this.slice();
        this.push_token(new Token(TokenType.NUMBER, value, location));
    }

    string(location) {
        this.advance(); // skip '"'

        const start_col = this.get_column();
        const start_row = this.row;
        const start = this.index;

        while (this.is_not_end() && this.peek() !== '"') {
            this.advance();
        }

        if (this.is_end()) {
            let err_line = this.source.slice(this.cursor - 1, this.index);
            let newline_idx = err_line.indexOf("\n");

            if (newline_idx !== -1) {
                err_line = err_line.substring(0, newline_idx);
            }

            pretty_error(
                start_row,
                start_col,
                err_line,
                "You forgot to close the string!"
            );
        }

        let value = this.slice(start);

        this.advance(); // skip '"'

        this.push_token(new Token(TokenType.STRING, value, location));
    }
}

try {
    _main();
} catch (e) {
    console.error(e);
}

function _main() {
    const CPP_REGEX = /.\.cpp/i;
    const args = process.argv;
    let filename = "main.cpp";

    for (const arg of args) {
        if (CPP_REGEX.test(arg)) {
            filename = arg;
        }
    }

    const source = readFileSync(filename, "utf8");
    const lexer = new Lexer(source);
    const tokens = lexer.scan_tokens();

    // console.log(lexer.tokens);

    const parser = new Parser(tokens);
    const statements = parser.parse();

    const output = [];
    output.push("fn main() {");

    for (const stmt of statements) {
        if (stmt instanceof PrintStmt) {
            output.push(`\tprint!("${stmt.string}");`);
        } else if (stmt instanceof ReturnStmt) {
            output.push(`\tstd::process::exit(${stmt.value});`);
        }
    }

    output.push("}\n");
    const text = output.join("\n");

    filename = filename.replace("cpp", "rs");
    writeFileSync(filename, text);
}

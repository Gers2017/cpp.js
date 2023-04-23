// ------- Parser --------

import { Token, TokenType } from "./main.js";
import { PrintStmt, ReturnStmt } from "./stuff.js";
import { panic } from "./utils.js";

const Errors = {
    EXPECT_INT_ERR: "Expected type annotation for main function",
    LEFT_PAREN_ERR: "Expected '('",
    RIGHT_PAREN_ERR: "Expected ')'",
    LEFT_BRACE_ERR: "Expected '{'",
    RIGHT_BRACE_ERR: "Expected '}'",
    PRINTF_ERR: 'Expected "printf" statement',
    SEMI_COLON_ERR: "Expected ';'",
    STRING_ERR: "Expected string literal",
    RETURN_ERR: "Expected return statement",
    RETURN_CODE_ERR: "Expected return code",
    NO_MORE_TOKENS_ERR: "No more tokens to parse!",
    EOF_ERR: "Expected EOF token at the end",
};

/**
 * @typedef { { token_type: number, error_message: string } } Pattern
 */

export class Parser {
    /** @param { Token[] } tokens */
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.back_index = this.tokens.length - 1;
        /**
         * @type { Stmt[] }
         */
        this.statements = [];
    }

    is_empty() {
        return this.tokens.length == 0;
    }

    is_not_empty() {
        return this.tokens.length > 0;
    }

    peek() {
        if (this.is_empty()) {
            panic(Errors.NO_MORE_TOKENS_ERR);
        }
        return this.tokens[0];
    }

    peek_back() {
        return this.tokens[this.tokens.length - 1];
    }

    pop_front() {
        if (this.is_empty()) {
            return null;
        }

        return this.tokens.shift();
    }

    pop_back() {
        if (this.is_empty()) {
            return null;
        }

        return this.tokens.pop();
    }

    parse() {
        // start main
        this.expect(TokenType.INT_TYPE, Errors.EXPECT_INT_ERR);

        const fn_name = this.expect(TokenType.IDENTIFIER).value;
        if (fn_name !== "main") {
            panic(`Invalid function name: "${fn_name}". Expected "main"`);
        }

        this.expect(TokenType.LEFT_PAREN, Errors.LEFT_PAREN_ERR);
        this.expect(TokenType.RIGHT_PAREN, Errors.RIGHT_PAREN_ERR);

        this.expect(TokenType.LEFT_BRACE, Errors.LEFT_BRACE_ERR);

        this.expect_back(TokenType.EOF, Errors.EOF_ERR);
        this.expect_back(TokenType.RIGHT_BRACE, Errors.RIGHT_BRACE_ERR);

        // end main

        while (this.is_not_empty()) {
            this.statements.push(this.get_next_stmt());
        }

        return this.statements;
    }

    /**
     * @param {number} expected_type
     * @param {string} error_message
     * @returns { Token }
     */
    expect(expected_type, error_message) {
        if (this.is_empty()) {
            panic(error_message);
        } else if (this.peek().token_type !== expected_type) {
            panic(`${error_message} at ${this.peek().loc.display()}`);
        }

        return this.pop_front();
    }

    /**
     * @param { number } expected_type
     * @param { string } error_message
     * @returns { Token }
     */
    expect_back(expected_type, error_message) {
        if (this.is_empty()) {
            panic(error_message);
        } else if (this.peek_back().token_type !== expected_type) {
            panic(`${error_message} at ${this.peek().loc.display()}`);
        }

        return this.pop_back();
    }

    get_next_stmt() {
        /**
         * @type { Token }
         */
        const token = this.peek();

        if (token.token_type === TokenType.PRINTF) {
            this.expect(TokenType.PRINTF, Errors.PRINTF_ERR); // skip print
            this.expect(TokenType.LEFT_PAREN, Errors.LEFT_PAREN_ERR); // skip '('
            const value = this.expect(
                TokenType.STRING,
                Errors.STRING_ERR
            ).value; // get the string!
            this.expect(TokenType.RIGHT_PAREN, Errors.RIGHT_PAREN_ERR); // skip ')'
            this.expect(TokenType.SEMICOLON, Errors.SEMI_COLON_ERR);

            return new PrintStmt(value);
        } else if (token.token_type === TokenType.RETURN) {
            // console.log("current:", this.peek()?.display());

            this.expect(TokenType.RETURN, Errors.RETURN_ERR); // skip return

            const value = this.expect(
                TokenType.NUMBER,
                Errors.RETURN_CODE_ERR
            ).value; // skip number

            this.expect(TokenType.SEMICOLON, Errors.SEMI_COLON_ERR);
            return new ReturnStmt(value);
        } else {
            panic(`Unexpected '${token.value}' ${token.display()}`);
        }
    }
}

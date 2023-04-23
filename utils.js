const ALPHA_REGEX = /[a-z]/i;
const ALPHA_NUM_REGEX = /[a-z0-9]/i;
const WHITESPACE_REGEX = /\s+/i;

export function is_digit(ch) {
    const code = ch.charCodeAt(0);
    return code > 47 && code < 58;
}

export function is_alpha(ch) {
    // return ch.charCodeAt(0) > 64 && ch.charCodeAt() < 123;
    return ch.match(ALPHA_REGEX);
}

export function is_alphanum(ch) {
    return ALPHA_NUM_REGEX.test(ch);
}

export function is_whitespace(ch) {
    return WHITESPACE_REGEX.test(ch);
}

export function panic(message) {
    console.error(message);
    exit_rand();
}

export function pretty_error(row, column, error_line, error_message) {
    console.error(`\x1b[31mError at line: ${row + 1} column: ${column + 1}`);
    console.error(`\n\x1b[33m  ${error_line}`);
    console.error(`  \x1b[0m^^^${error_message}`);
    exit_rand();
}

export function exit_rand() {
    const rand_code = Math.round(42 + Math.random() * 28);
    process.exit(rand_code);
}

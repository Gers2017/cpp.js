import { writeFileSync } from "fs";
import { Stmt, PrintStmt, ReturnStmt } from "./stuff.js";

/**
 *
 * @param {Stmt[]} statements
 */
export function generate_rust_code(filename, statements) {
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

    writeFileSync(filename, text);
}

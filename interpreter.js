import { writeFileSync } from "fs";
import { Stmt, PrintStmt, ReturnStmt } from "./stuff.js";

/**
 * @param {string} filename
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

/**
 * @param {string} filename
 * @param {Stmt[]} statements
 */
export function generate_fasm_linux(filename, statements) {
    const output = [];
    output.push("format ELF executable 3");
    output.push("entry start");
    output.push("segment readable executable");
    output.push("start:");

    const push_syscall = () => output.push("int 0x80");

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        if (stmt instanceof PrintStmt) {
            output.push("mov eax, 4"); // write syscall
            output.push("mov ebx, 1"); // stdout (fd)
            output.push(`mov ecx, str${i}`);
            output.push(`mov edx, ${stmt.string.length}`);
            push_syscall();
        } else if (stmt instanceof ReturnStmt) {
            output.push("mov eax, 1"); // exit syscall
            output.push(`mov ebx, ${stmt.value}`); // return code
            push_syscall();
        }
    }

    output.push("segment readable writeable");

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (stmt instanceof PrintStmt) {
            const message = [...stmt.string]
                .map((ch) => ch.charCodeAt(0))
                .join(",");

            output.push(`str${i} db ${message}`);
        }
    }

    const text = output.join("\n");
    writeFileSync(filename, text);
}

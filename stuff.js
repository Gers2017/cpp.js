export class Stmt {}

export class PrintStmt extends Stmt {
    /**
     *
     * @param {string} string
     * @param {string[] | undefined} args
     */
    constructor(string, args) {
        super();
        this.string = string;
        this.args = args ?? [];
    }
}

export class ReturnStmt extends Stmt {
    /**
     *
     * @param {NumberExpr} value
     */
    constructor(value) {
        super();
        this.value = value;
    }
}

// TODO
export class IfStmt extends Stmt {}

export class ElseStmt extends Stmt {}

export class AST {}

export class Block extends AST {
    constructor(stmts) {
        super();
        this.stmts = stmts;
    }
}

export class NumberNode extends AST {
    constructor(value) {
        super();
        this.value = value;
    }
}

export class BinaryExpr extends AST {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}

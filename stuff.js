export class AST {}
export class Stmt {}

export class Block extends AST {
    constructor(stmts) {
        super();
        this.stmts = stmts;
    }
}

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

export class Expr {}

export class EqualsExpr {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

export class Num {
    constructor(value) {
        this.value = value;
    }
}

export class FunctionDeclaration extends Stmt {
    constructor(name, params, body) {
        super();
    }
}

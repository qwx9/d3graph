class SymElem{
	readonly sym: Sym;
	readonly root: ExprElem;
	readonly span: DSpan;

	constructor(sym: Sym, expr: ExprElem){
		this.sym = sym;
		this.root = expr;
	}
}

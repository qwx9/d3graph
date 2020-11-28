class SymElem{
	readonly sym: Sym;
	readonly isobj: boolean;
	readonly span: HTMLSpanElement;
	readonly label: HTMLSpanElement;
	readonly value: HTMLSpanElement;

	constructor(sym: Sym){
		this.sym = sym;
		this.isobj = sym.rule.val instanceof RObj || sym.rule.val instanceof RFileObj;
		this.span = addspan(sym.parent.el.value, null);
		this.label = addspan(this.span, sym.rule.sym);
		if(this.isobj)
			addspan(this.span, "(");
		this.value = addspan(this.span);
		if(this.isobj)
			addspan(this.span, ")");
		if(!(sym.parent instanceof Expr))
			addbutton(this.span, "x", () => {
				this.sym.pop();
			});
	}
	pop(){
		this.span.remove();
	}
}

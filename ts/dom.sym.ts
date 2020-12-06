class SymElem{
	readonly sym: Sym;
	readonly isobj: boolean;
	readonly span: HTMLSpanElement;
	readonly value: HTMLSpanElement;

	constructor(sym: Sym){
		this.sym = sym;
		this.isobj = sym.rule.val instanceof RObj;
		this.span = addspan(sym.parent.el.value, null);
		/* domvis-specific: must avoid duplicating control for root element
		 * here for root sym, and also in dom.val.ts */
		if(sym.parent instanceof Expr){
			this.value = addspan(this.span);
			return this;
		}
		addspan(this.span, sym.rule.sym);
		if(sym.val === null){
			this.value = addspan(this.span);
			return this;
		}
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

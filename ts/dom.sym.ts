class SymElem{
	readonly sym: Sym;
	readonly isobj: boolean;
	readonly span: HTMLSpanElement;
	readonly label: HTMLSpanElement;
	readonly value: HTMLSpanElement;
	readonly del: HTMLButtonElement;

	constructor(sym: Sym){
		this.sym = sym;
		this.isobj = sym.val instanceof Robj || sym.val instanceof RFileObj;
		this.span = addspan(sym.parent.value, "span");
		this.label = addspan(this.span, sym.rule.sym);
		if(this.isobj)
			addspan(this.span, "(");
		this.value = addspan(this.span);
		if(this.isobj)
			addspan(this.span, ")");
		this.del = addbutton(this.span, "x", () => {
			this.sym.pop();
		});
	}
	pop(){
		this.span.remove();
	}
}

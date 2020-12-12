class SymElem{
	readonly sym: Sym;
	readonly span: HTMLElement;
	readonly value: HTMLSpanElement;

	constructor(sym: Sym){
		this.sym = sym;
		if(sym.parent instanceof Sym && sym.parent.parent instanceof BppOpt)
			this.span = adddiv(sym.parent.el.value);
		else
			this.span = addspan(sym.parent.el.value, null);
		addspan(this.span, sym.rule.label);
		if(sym.val === null){
			this.value = addspan(this.span);
			return this;
		}
		const multiple = this.sym.val instanceof VParam;
		if(multiple)
			addspan(this.span, "(");
		this.value = addspan(this.span);
		if(multiple)
			addspan(this.span, ")");
		if(!(sym.parent instanceof BppOpt))
			addbutton(this.span, "x", () => {
				this.sym.pop();
			});
	}
	pop(){
		this.span.remove();
	}
}

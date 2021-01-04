class SymElem{
	readonly sym: Sym;
	readonly span: HTMLElement;
	readonly value: HTMLSpanElement;

	constructor(sym: Sym){
		this.sym = sym;
		if(sym.parent instanceof Sym && sym.parent.parent instanceof BppOpt){
			this.span = adddiv(sym.parent.el.value);
			this.span.style.paddingLeft = "10px";
			addspan(this.span, sym.rule.label);
		}else{
			this.span = addspan(sym.parent.el.value, null);
			if(sym.parent instanceof BppOpt)
				addspan(this.span, sym.rule.label).style.fontWeight = "bold";
			else
				addspan(this.span, sym.rule.label);
		}
		if(sym.val === null){
			this.value = addspan(this.span);
			return this;
		}
		const multiple = this.sym.rule.val instanceof RParam;
		if(multiple)
			addspan(this.span, "(");
		this.value = addspan(this.span);
		if(multiple)
			addspan(this.span, ")");
		if(!(sym.parent instanceof BppOpt))
			addbutton(this.span, "x", () => {
				this.sym.pop();
			}).className = "btn btn-secondary btn-sm";
	}
	pop(){
		this.span.remove();
	}
}

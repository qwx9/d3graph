/* Sym node, associated DOM element */
class SymElem{
	readonly sym: Sym;	/* parent Sym node */
	readonly span: HTMLElement;	/* this node's root span */
	readonly value: HTMLSpanElement;	/* container div for child elements */

	constructor(sym: Sym){
		/* save pointer to parent sym node */
		this.sym = sym;
		/* if this sym's parent is a root sym, then this is the start of a new
		 * expression, for which we need a new div (visually, a newline) */
		if(sym.parent instanceof Sym && sym.parent.parent instanceof BppOpt){
			/* create this element's div inside parent's container,
			 * set padding for prettiness, and paste the sym's label */
			this.span = adddiv(sym.parent.el.value);
			this.span.style.paddingLeft = "10px";
			addspan(this.span, sym.rule.label);
		}else{
			/* just addend a new span to continue on the same line */
			this.span = addspan(sym.parent.el.value, null);
			/* if this sym is the first child of a BppOpt node, it is a
			 * root node from which new expressions (bpp config lines) of
			 * its type can be spawned, in which case use its label as a
			 * title */
			if(sym.parent instanceof BppOpt)
				addspan(this.span, sym.rule.label).style.fontWeight = "bold";
			else
				addspan(this.span, sym.rule.label);
		}
		/* if the sym does not have suboptions, just initialize .value and
		 * leave it bare for future development */
		if(sym.val === null){
			this.value = addspan(this.span);
			return this;
		}
		/* if this value is a function with parameters, then surround its
		 * value with parenthesis */
		const multiple = this.sym.rule.val instanceof RParam;
		if(multiple)
			addspan(this.span, "(");
		/* add container span for value subtree */
		this.value = addspan(this.span);
		if(multiple)
			addspan(this.span, ")");
		/* if this isn't a root sym which should never be removed, add
		 * a delete button which will pop this sym, DOM element and
		 * children */
		if(!(sym.parent instanceof BppOpt))
			addbutton(this.span, "x", () => {
				this.sym.pop();
			/* pretty css class */
			}).className = "btn btn-secondary btn-sm";
	}
	/* remove this DOM element: just remove the entire span to clear
	 * everything */
	pop(){
		this.span.remove();
	}
}

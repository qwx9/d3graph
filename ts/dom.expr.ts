class ExprElem{
	readonly expr: Expr;
	readonly div: HTMLDivElement;
	readonly del: HTMLButtonElement;
	readonly label: HTMLSpanElement;
	readonly equals: HTMLSpanElement;
	readonly value: HTMLSpanElement;

	constructor(expr: Expr){
		this.expr = expr;
		this.div = adddiv(expr.option.el.value);
		this.del = addbutton(this.div, "x", () => {
			this.expr.pop();
		});
		this.label = addspan(this.div, expr.ref());
		this.equals = addspan(this.div, " = ");
		this.value = addspan(this.div);
	}
	setid(id: string){
		this.label.textContent = this.expr.ref();
	}
	pop(){
		this.div.remove();
	}
}

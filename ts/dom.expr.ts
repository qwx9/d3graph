class ExprElem{
	readonly expr: Expr;
	readonly div: HTMLDivElement;
	readonly del: DButton;
	readonly label: HTMLSpanElement;
	readonly equals: HTMLSpanElement;
	readonly value: HTMLSpanElement;

	constructor(expr: Expr){
		this.expr = expr;
		this.div = adddiv(expr.option.el.datdiv);
		this.del = addbutton(this.div, "x", () => {
			this.expr.pop();
		});
		this.label = addspan(this.div, expr.ref());
		this.equals = addspan(this.div, " = ");
		this.value = addspan(this.div);
	}
	setid(i: number){
		this.label.textContent = this.expr.ref();
	}
	pop(){
		this.div.remove();
	}
}

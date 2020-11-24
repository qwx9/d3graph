class Expr{
	readonly el: ExprElem;
	readonly option: Option;
	id: number;
	sym: Sym;

	constructor(option: Option, rule: Rule, id: number){
		this.option = option;
		this.id = id;
		this.el = new ExprElem(this);
		this.sym = new Sym(this, rule);
	}
	setid(i: number){
		this.id = i;
		el.setid(i);
	}
	ref(suff: string): string{
		return this.option.name + this.id;
	}
	pop(){
		this.option.pop(this);
		this.el.pop();
		this.sym.pop();
	}
}

class Expr{
	readonly el: ExprElem;
	readonly option: Option;
	id: number;
	sym: Sym;

	constructor(option: Option, rule: Rule, id: number){
		this.option = option;
		this.id = id;
		this.sym = new Sym(this, rule);
		this.el = new ExprElem(this);
	}
	setid(i: number){
		this.id = i;
		el.setid(i);
	}
	ref(suff: string): string{
		return this.option.name;
	}
	pop(){
		this.option.pop(this);
		this.el.pop();
		this.sym.pop();
	}
}

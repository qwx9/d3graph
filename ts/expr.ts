class Expr{
	readonly el: ExprElem;
	readonly option: BppOpt;
	id: number;
	sym: Sym;

	constructor(option: BppOpt, rule: Rule, id: number){
		this.option = option;
		this.id = id;
		this.el = new ExprElem(this);
		this.sym = new Sym(this, rule);
	}
	setid(i: number){
		this.id = i;
		this.el.setid(i);
	}
	ref(suff: string | null = null): string{
		(suff);
		return this.option.name + this.id;
	}
	compile(): string{
		return this.ref() + " = " + this.sym.compile();
	}
	pop(){
		this.option.pop(this);
		this.el.pop();
		this.sym.pop();
	}
}

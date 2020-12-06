class Expr{
	readonly el: ExprElem;
	readonly option: BppOpt;
	id: string;
	sym: Sym;

	constructor(option: BppOpt, i: number, id: string){
		this.option = option;
		this.id = id;
		this.el = new ExprElem(this);
		this.sym = new Sym(this, option.rule);
		this.sym.set(i);
	}
	setid(id: string){
		this.id = id;
		this.el.setid(id);
	}
	rootid(){
		return this.id;
	}
	ref(suff: string | null = null): string{
		(suff);
		return this.option.rule.sym + this.id;
	}
	compile(): string{
		//return this.ref() + " = " + this.sym.compile();
		return this.sym.compile();
	}
	pop(){
		this.option.pop(this);
		this.el.pop();
		this.sym.pop();
	}
}

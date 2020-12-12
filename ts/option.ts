class BppOpt{
	readonly el: BppOptElem;
	readonly name: string;
	readonly rule: Rule;
	readonly rootsym: Sym;

	constructor(name: string){
		this.name = name;
		this.rule = rules[name];
		this.el = new BppOptElem(this);
		this.rootsym = new Sym(this, this.rule);
	}
	compile(): string{
		if(this.rootsym.val === null
		|| this.rootsym.val.val === null
		|| this.rootsym.val.val instanceof Array && this.rootsym.val.val.length === 0
		|| this.rootsym.val.val instanceof Object && Object.keys(this.rootsym.val.val).length === 0)
			return "";
		else
			return this.rootsym.compile() + "\n";
	}
}

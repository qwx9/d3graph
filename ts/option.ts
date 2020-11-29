class BppOpt{
	readonly el: BppOptElem;
	readonly name: string;
	readonly rule: Rule;
	readonly rlist: Rule[];
	readonly update: () => void | null;
	expr: Expr[];

	constructor(name: string, update: (() => void) | null = null){
		this.name = name;
		this.rule = rules[name];
		this.rlist = this.rule.val.rules;
		this.expr = [];
		this.update = update;
		this.el = new BppOptElem(this);
	}
	push(i: number){
		if(i >= this.rlist.length)
			fatal(this.name + ".push: index out of bounds: " + i);
		if(this.update !== null)
			this.update();
		const e = new Expr(this, this.rlist[i], this.expr.length + 1);
		this.expr.push(e);
	}
	set(i: number){
		this.nuke();
		this.push(i);
	}
	compile(){
		let s = [];
		this.expr.forEach((e) => {
			s.push(e.compile());
		});
		return s;
	}
	nuke(){
		while(this.expr.length > 0)
			this.expr[0].pop();
	}
	pop(expr: Expr){
		let i = expr.id - 1;
		this.expr.splice(i, 1);
		for(; i<this.expr.length; i++)
			this.expr[i].setid(i + 1);
	}
}

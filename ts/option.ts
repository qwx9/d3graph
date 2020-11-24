class Option{
	readonly el: OptionElem;
	readonly name: string;
	readonly rule: Rule;
	readonly rlist: Rule[];
	readonly set: (number) => void;
	readonly update: () => void | null;
	expr: Expr[];

	constructor(name: string, update: (() => void) | null = null){
		this.name = name;
		this.rule = rules[name];
		this.rlist = rules[name].val.rules;
		this.expr = [];
		this.set = (this.rule.val instanceof RSelect) ? this.setone : this.push;
		this.update = update;
		this.el = new OptionElem(this);
	}
	push(i: number){
		if(i >= this.rlist.length)
			fatal(this.name + ".push: index out of bounds: " + i);
		if(this.update !== null)
			this.update();
		const e = new Expr(this, this.rlist[i], this.expr.length + 1);
		this.expr.push(e);
	}
	setone(i: number){
		this.nuke();
		this.push(i);
	}
	nuke(){
		this.expr.forEach((e) => {
			e.pop();
		});
		this.expr = [];
	}
	pop(expr: Expr){
		let i = expr.id - 1;
		this.expr.splice(i, 1);
		for(; i<this.expr.length; i++)
			this.expr[i].setid(i + 1);
	}
}

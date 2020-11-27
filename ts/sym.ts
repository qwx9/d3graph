class Sym{
	readonly el: SymElem;
	readonly parent: Expr | Sym;
	readonly rule: Rule;
	readonly parentpopfn: (Sym) => void;
	val: Value;

	constructor(parent: Expr | Sym, rule: Rule, parentpopfn: (Sym) => void = null){
		this.parent = parent;
		this.parentpopfn = parentpopfn;
		this.rule = rule;
		this.el = new SymElem(this);
		this.val = rule.putval(this);
	}
	ref(suff: string | null = null): string{
		let r = this.parent.ref(this.rule.sym);
		if(suff !== null)
			r += "." + suff;
		return r;
	}
	set(val: number){
		this.val.set(val);
	}
	pop(){
		if(this.parentpopfn !== null)
			this.parentpopfn(this);
		this.val.pop();
		this.el.pop();
	}
}

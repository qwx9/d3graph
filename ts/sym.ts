class Sym{
	readonly el: SymElem;
	readonly parent: Expr | Sym;
	readonly parentval: VObj | VFileObj | null;
	readonly rule: Rule;
	val: Value | null;

	constructor(parent: Expr | Sym, rule: Rule, parentval: VObj | VFileObj | null = null){
		this.parent = parent;
		this.parentval = parentval;
		this.rule = rule;
		this.el = new SymElem(this);
		this.val = rule.val === null ? null : rule.putval(this);
	}
	ref(suff: string | null = null): string{
		let r = this.parent.ref(this.rule.sym);
		if(suff !== null)
			r += "." + suff;
		return r;
	}
	set(val: number){
		if(this.val === null)
			fatal(this.ref() + ": cannot set null value");
		this.val!.set(val);
	}
	compile(): string{
		return this.rule.sym + (this.val === null ? "" : this.val.compile());
	}
	pop(){
		if(this.parentval !== null)
			this.parentval.popchild(this);
		if(this.val !== null)
			this.val.pop();
		this.el.pop();
	}
}

class Sym{
	readonly el: SymElem;
	readonly parent: Sym | BppOpt;
	readonly rule: Rule;
	val: Value | null;

	constructor(parent: Sym | BppOpt, rule: Rule){
		this.parent = parent;
		this.rule = rule;
		this.el = new SymElem(this);
		this.val = rule.val === null ? null : rule.putval(this);
	}
	rootref(): string{
		return this.parent instanceof BppOpt ? this.ref() : this.parent.rootref();
	}
	ref(): string{
		if(this.parent instanceof BppOpt)
			return this.rule.rsym;
		else if(this.parent.val instanceof VAny)
			return this.parent.ref() + (this.parent.val.index(this) + 1)
				+ "." + this.rule.rsym;
		else
			return this.parent.ref() + "." + this.rule.rsym;
	}
	set(i: number){
		if(this.val === null)
			fatal(this.ref() + ": cannot set null value");
		else
			this.val.set(i);
	}
	compile(): string{
		/* if of these types, the value itself should handle entire key=val compilation;
		 * Any/Once return multiple lines and Ref must be jumped over to its actual value */
		if(this.val instanceof VRef
		|| this.val instanceof VAny
		|| this.val instanceof VOnce)
			return this.val.compile();
		return this.rule.rsym + (this.val === null ? "" : this.val.compile());
	}
	pop(){
		if(this.parent instanceof BppOpt){
			fatal(this.ref() + ": cannot pop root sym");
			return;
		}else if(this.parent.val !== null
		&& typeof this.parent.val.popchild === "function")
			this.parent.val.popchild(this);
		if(this.val !== null)
			this.val.pop();
		this.el.pop();
	}
}

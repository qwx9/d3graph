class Sym{
	readonly el: SymElem;
	readonly parent: Sym | BppOpt;
	readonly rule: Rule;
	readonly rref: Ref | null;
	val: Value | null;
	zombie: boolean;

	constructor(parent: Sym | BppOpt, rule: Rule){
		this.parent = parent;
		this.rule = rule;
		this.el = new SymElem(this);
		this.val = rule.val === null ? null : rule.putval(this);
		if(!(parent instanceof BppOpt) && reftab.hasOwnProperty(parent.rule.rsym)){
			this.rref = reftab[parent.rule.rsym];
			this.rref.add(this);
		}else
			this.rref = null;
		this.zombie = false;
	}
	rootref(): string{
		return this.parent instanceof BppOpt ? this.ref() : this.parent.rootref();
	}
	ref(): string{
		if(this.zombie)
			return "(invalid)";
		if(this.parent instanceof BppOpt)
			return this.rule.rsym;
		let s = this.parent.ref();
		if(this.parent.val instanceof VAny)
			s += (this.parent.val.index(this) + 1);
		if(this.val instanceof RRef)
			return s;
		return s + "." + this.rule.rsym;
	}
	set(i: number){
		if(this.val === null)
			fatal(this.ref() + ": cannot set null value");
		else
			this.val.set(i);
	}
	compile(): string{
		const pref = this.rule.inheritname ? this.parent.rule.rsym + "." : "";
		/* if of these types, the value itself should handle entire key=val compilation;
		 * Any/Once return multiple lines */
		if(this.val instanceof VAny
		|| this.val instanceof VOnce)
			return this.val.compile(pref);
		return pref + this.rule.rsym + (this.val === null ? "" : this.val.compile());
	}
	pop(){
		if(this.parent instanceof BppOpt){
			fatal(this.ref() + ": cannot pop root sym");
			return;
		}
		/* invalidate ref immediately, the rest has to rely on pointers to this */
		this.zombie = true;
		if(this.parent.val !== null
		&& typeof this.parent.val.popchild === "function")
			this.parent.val.popchild(this);
		if(this.rref !== null)
			this.rref.remove(this);
		if(this.val !== null)
			this.val.pop();
		this.el.pop();
	}
}

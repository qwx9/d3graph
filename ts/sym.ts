/* symbol nodes instanciated from a given rule. parallel to the ruleset tree,
 * user can spawn new elements (symbols) to create an expression, ie. rules
 * specify how and where symbols may be created. */
class Sym{
	readonly el: SymElem;			/* associated visual element */
	readonly parent: Sym | BppOpt;		/* parent node */
	readonly rule: Rule;			/* associated rule */
	readonly rref: Ref | null;		/* associated reference table */
	val: Value | null;			/* symbol value */
	zombie: boolean;			/* invalidated node waiting to be reaped */

	constructor(parent: Sym | BppOpt, rule: Rule){
		this.parent = parent;
		this.rule = rule;
		/* create visual element */
		this.el = new SymElem(this);
		/* create value node if there can be one */
		this.val = rule.val === null ? null : rule.putval(this);
		/* if the parent is a reference rule, then this node must be
		 * added to its associated reference table as one of the
		 * instanciated symbols */
		if(!(parent instanceof BppOpt) && reftab.hasOwnProperty(parent.rule.rsym)){
			this.rref = reftab[parent.rule.rsym];
			this.rref.add(this);
		}else
			this.rref = null;
		this.zombie = false;
	}
	/* return id of root node */
	rootref(): string{
		return this.parent instanceof BppOpt ? this.ref() : this.parent.rootref();
	}
	/* return symbol id or textual reference: recurse back to the
	 * parent, concatenating names to construct a unique identifier.
	 * this cannot be relied upon as it is not constant, and should be
	 * used only at compilation or for debugging. id can change if
	 * other symbols are deleted or pushed, and repairing references
	 * everywhere would be complex and bug-prone. */
	ref(): string{
		/* shouldn't happen */
		if(this.zombie)
			return "(invalid)";
		/* if the root symbol is reached, stop recursion */
		if(this.parent instanceof BppOpt)
			return this.rule.rsym;
		/* recurse back to parent */
		let s = this.parent.ref();
		/* values in any-lists are indexed since they can repeat,
		 * and the index stored in the Value itself is 0-indexed */
		if(this.parent.val instanceof VAny)
			s += (this.parent.val.index(this) + 1);
		/* if this sym is a reference, its label is redundant */
		if(this.val instanceof VRef)
			return s;
		/* append this sym's internal label to the id chain */
		return s + "." + this.rule.rsym;
	}
	/* set symbol value or push new sym to this subtree depending
	 * on value type. */
	set(i: number){
		/* shouldn't happen */
		if(this.val === null)
			fatal(this.ref() + ": cannot set null value");
		/* Value classes handle spawning sub-symbols for lists, etc.
		 * via this callback. */
		else
			this.val.set(i);
	}
	/* compile symbol sub-tree into one or more valid bpp config
	 * statements: starting with this symbol, traverse subtree
	 * starting with the sym's value, which itself can contain syms.
	 * this recurses starting with the root sym in a depth-first
	 * manner to form one or more lines of expressions. */
	compile(): string{
		const pref = this.rule.inheritname ? this.parent.rule.rsym + "." : "";
		/* if of these types, the value itself should handle entire
		 * key=val compilation; Any/Once return multiple lines. */
		if(this.val instanceof VAny
		|| this.val instanceof VOnce)
			return this.val.compile(pref);
		/* concatenate subtree elements to form an expression
		 * starting with this sym. */
		return pref + this.rule.rsym + (this.val === null ? "" : this.val.compile());
	}
	/* pop symbol and its subtree from the tree. recurse depth-first
	 * through the subtree and pop elements starting with the
	 * terminal leaves. besides reclaiming memory, this is
	 * necessary to invalidate pointers to the sym, repair the
	 * reference table and remove visual elements. */
	pop(){
		/* root sym serves to spawn expressions and cannot be
		 * removed. */
		if(this.parent instanceof BppOpt){
			fatal(this.ref() + ": cannot pop root sym");
			return;
		}
		/* invalidate ref immediately, the rest has to rely on
		 * pointers to this sym. */
		this.zombie = true;
		/* .popchild functions are employed to repair a
		 * parent's array or dict to remove the element
		 * from there as well and perform any other
		 * type-specific handling. */
		if(this.parent.val !== null
		&& typeof this.parent.val.popchild === "function")
			this.parent.val.popchild(this);
		/* remove the sym from the reference table if it is
		 * indeed referenced. */
		if(this.rref !== null)
			this.rref.remove(this);
		/* if the sym has a value, pop it as well. it will
		 * pop its own visual elements and subtree. */
		if(this.val !== null)
			this.val.pop();
		/* pop this sym's visual element. */
		this.el.pop();
	}
}

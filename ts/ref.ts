/* references, pointers collected in a reftable entry for a specific
 * symbol node type. this must handle cases where new symbols old ones
 * are deleted, to check existing references and remove symbols pointing
 * to the deleted one, or to add a new symbol to the table and to the
 * options list for every pointer to the same type (on the ui).
 * to accomplish this, Ref must store both a collection of symbols which
 * can be pointed to, and a collection of pointers pointing to one of the
 * symbols. */
class Ref{
	readonly name: string;		/* identifier */
	syms: Sym[];			/* collection of refererrable instanciated symbols */
	refs: (VRef | VAnyRef)[];	/* instanciated pointers to such symbols */

	constructor(name: string){
		this.name = name;
		this.syms = [];
		this.refs = [];
	}
	/* add a new referrable symbol. */
	add(sym: Sym){
		/* duplicates are not allowed, checked by comparing
		 * pointer values rather than symbol id's, since those
		 * cannot be relied on. */
		for(let i=0; i<this.syms.length; i++)
			if(this.syms[i] === sym)
				fatal("ref table " + name + ".add: attempt to add duplicate sym: " + sym.ref());
		/* save new symbol and call each ref value's handler to
		 * update its options list (mainly to update the ui). */
		this.syms.push(sym);
		this.refs.forEach((r) => {
			r.addsymref(sym);
		});
	}
	/* remove a symbol from the table. */
	remove(sym: Sym){
		let i;
		/* sanity check */
		for(i=0; i<this.syms.length; i++)
			if(this.syms[i] === sym)
				break;
		if(i === this.syms.length)
			fatal("ref table " + name + ".remove: no such sym: " + sym.ref());
		/* call removal handler of each ref value: references
		 * to the sym must be invalidated and option lists
		 * updated. */
		this.refs.forEach((r) => {
			r.removesymref(sym);
		});
		/* remove it. */
		this.syms.splice(i, 1);
	}
	/* add a pointer to a symbol. */
	addref(val: VRef | VAnyRef){
		/* duplicates are not allowed. */
		for(let i=0; i<this.refs.length; i++)
			if(this.refs[i] === val)
				fatal("ref table " + name + ".addref: attempt to add duplicate ref: " + val.sym.ref());
		this.refs.push(val);
	}
	/* remove a pointer to a symbol. */
	removeref(val: VRef | VAnyRef){
		let i;
		/* sanity check */
		for(i=0; i<this.refs.length; i++)
			if(this.refs[i] === val)
				break;
		if(i === this.refs.length)
			fatal("ref table " + name + ".removeref: no such ref: " + val.sym.ref());
		this.refs.splice(i, 1);
	}
}

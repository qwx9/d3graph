class Ref{
	readonly name: string;
	syms: Sym[];
	refs: (VRef | VAnyRef)[];

	constructor(name: string){
		this.name = name;
		this.syms = [];
		this.refs = [];
	}
	add(sym: Sym){
		for(let i=0; i<this.syms.length; i++)
			if(this.syms[i] === sym)
				fatal("ref table " + name + ".add: attempt to add duplicate sym: " + sym.ref());
		this.syms.push(sym);
		this.refs.forEach((r) => {
			r.addsymref(sym);
		});
	}
	remove(sym: Sym){
		let i;
		for(i=0; i<this.syms.length; i++)
			if(this.syms[i] === sym)
				break;
		if(i === this.syms.length)
			fatal("ref table " + name + ".remove: no such sym: " + sym.ref());
		this.refs.forEach((r) => {
			r.removesymref(sym);
		});
		this.syms.splice(i, 1);
	}
	addref(val: VRef | VAnyRef){
		for(let i=0; i<this.refs.length; i++)
			if(this.refs[i] === val)
				fatal("ref table " + name + ".addref: attempt to add duplicate ref: " + val.sym.ref());
		this.refs.push(val);
	}
	removeref(val: VRef | VAnyRef){
		let i;
		for(i=0; i<this.refs.length; i++)
			if(this.refs[i] === val)
				break;
		if(i === this.refs.length)
			fatal("ref table " + name + ".removeref: no such ref: " + val.sym.ref());
		this.refs.splice(i, 1);
	}
}

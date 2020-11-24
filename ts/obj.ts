class Obj{
	readonly el: ObjElem;
	readonly sym: Sym;
	readonly rule: Rule;
	parms: Sym[];

	constructor(){
	}
	pop(){
		this.value.pop();
		this.el.pop();
	}
}

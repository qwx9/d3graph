function fatal(err: string){
	console.log(err);
	throw new Error(err);
}

function newelement(type: string){
	const e = document.createElement(type);
	if(e === null)
		fatal("newelement: couldn't create new element");
	return e;
}

function adddiv(parent: HTMLDivElement){
	const d = newelement("div") as HTMLDivElement;
	parent.appendChild(d);
	return d;
}

function addlabel(parent: HTMLDivElement, label: string){
	const lab = newelement("span") as HTMLSpanElement;
	lab.textContent = label;
	parent.appendChild(lab);
}

function addoption(sel: HTMLSelectElement, val: string, disabled: boolean = false, selected: boolean = false){
	const o = newelement("option") as HTMLOptionElement;
	o.value = val;
	o.textContent = val;
	if(disabled)
		o.disabled = true;
	if(selected){
		o.selected = true;
		o.defaultSelected = true;
	}
	sel.add(o);
}

function addbutt(parent: HTMLDivElement, label: string, fn: () => void){
	const but = newelement("button") as HTMLButtonElement;
	but.textContent = label;
	but.addEventListener("click", fn);
	parent.appendChild(but);
}

class Rule{
	label: string;
	sym: string;
	val: Rule[] | number | null;
	refs: {[index: string]: Sym};

	constructor(label: string, val: number | Rule[] | null = null, sym?: string){
		this.label = label;
		this.sym = sym ? sym : label;
		this.val = val;
		this.refs = {};
	}
}
const rules: { [name: string]: Rule[]; } = {
	"alpha": [
		new Rule("DNA", []),
		new Rule("RNA", []),
		new Rule("Protein", []),
		new Rule("Binary", []),
		new Rule("Word", [
			new Rule("Letter", [
				new Rule("DNA", []),
				new Rule("RNA", []),
				new Rule("Protein", []),
			], "letter"),
			new Rule("Length", 1, "length"),

		]),
		new Rule("Codon", [
			new Rule("Letter", [
				new Rule("DNA", []),
				new Rule("RNA", []),
			], "letter"),
		]),
	],
	"index1": [
		new Rule("None", []),
	],
	"index2": [
		new Rule("None", []),
	],
	"seq": [
		new Rule("Fasta", [
			new Rule("extended", 0),
			new Rule("strictNames", 0),
		]),
		new Rule("Mase", [
			new Rule("siteSelection", 1),
		]),
		new Rule("Phylip", [
			new Rule("order", [
				new Rule("interleaved", []),
				new Rule("sequential", []),
			]),
			new Rule("type", [
				new Rule("classic", []),
				new Rule("extended", []),
			]),
			new Rule("split", [
				new Rule("spaces", []),
				new Rule("tab", []),
			]),
		]),
		new Rule("Clustal", [
			new Rule("extraSpaces", 0),
		]),
		new Rule("Dcse", []),
		new Rule("Nexus", []),
		new Rule("Genbank", []),
	],
	"tree": [
		new Rule("Newick", []),
		new Rule("Nexus", []),
		new Rule("NHX", []),
	],
	"model": [
		new Rule("JC69", []),
		new Rule("K80", [
			new Rule("kappa", 1),
		]),
		new Rule("F84", [
			new Rule("kappa", 0.1),
			new Rule("theta", 0.1),
			new Rule("theta1", 0.1, "theta_1"),
			new Rule("theta2", 0.1, "theta_2"),
			// FIXME: equilibrium frequencies, everywhere
		]),
		new Rule("HKY85", [
			new Rule("kappa", 0.1),
			new Rule("theta", 0.1),
			new Rule("theta1", 0.1, "theta_1"),
			new Rule("theta2", 0.1, "theta_2"),
		]),
		new Rule("T92", [
			new Rule("kappa", 0.1),
			new Rule("theta", 0.1),
		]),
		new Rule("TN93", [
			new Rule("kappa1", 0.1, "kappa_1"),
			new Rule("kappa2", 0.1, "kappa_2"),
			new Rule("theta", 0.1),
			new Rule("theta1", 0.1, "theta_1"),
			new Rule("theta2", 0.1, "theta_2"),
		]),
		new Rule("testmodel", [
			new Rule("test", []),
			new Rule("test2", [
				new Rule("more", 9001),
				new Rule("moremore", 0.1),
				new Rule("stuff", [
					new Rule("end", 89),
				]),
			]),
			new Rule("testval", 42),
		]),
		new Rule("testmodel-1", 44),
	],
	"root": [
		new Rule("Frequency set", [
			new Rule("Fixed", []),
			new Rule("GC", [
				new Rule("theta", 0.1),
			]),
		]),
		new Rule("Rate distribution", [
			new Rule("Constant", []),
			new Rule("Gamma", [
				new Rule("n", 2),
				new Rule("alpha", 0.5),
			]),
		]),
	],
	"rate": [
	],
	"proc": [
	],
	"phyl": [
	],
};

class Sym{
	readonly rule: Rule;
	readonly parent: Sym | Primitive;
	parentid: number | null;	FIXME
	obj: Obj | null;
	vals: {[index: string]: Sym};
	val1: number | null;
	
	constructor(rule: Rule, parent: Sym | Primitive, div: HTMLDivElement | null){
		this.rule = rule;
		this.parent = parent;
		this.vals = {};
		this.val1 = null;
		if(div === null)
			this.obj = null;
		else{
			this.obj = new Obj(this, div, 




		if(parent instanceof Primitive){
		
		}
		if(parent instanceof HTMLDivElement){
			this.obj = new Obj(this, parent as HTMLDivElement, 
		}else
			this.obj = null;



		rule.refs[this.ref()] = this;
		if(parent instanceof Sym)
			parent.pushval(this);
	}
	has(rule: Rule){
		return rule.sym in this.vals;
	}
	private rref(s: string): string{
		if(this.parent instanceof Primitive)
			return this.obj!.div.id + "." + s;
		return (this.parent as Sym).rref(this.rule.sym) + "." + s;
	}
	ref(){
		return this.rref(this.rule.sym);
	}
	pushval(sym: Sym){
		this.val1 = null;
		this.vals[sym.rule.sym] = sym;
	}
	pop(){
		delete this.rule.refs[this.ref()];
		this.reset();
		if(this.obj !== null)
			this.obj.pop();
	}
	reset(){
		for(let k in this.vals){
			this.vals[k].pop();
			delete this.vals[k];
		}
		this.val1 = null;
	}
	setval1(v: number){
		this.reset();
		this.val1 = v;
	}
	setvals(i: number, selop: HTMLOptionElement): Sym | null{
		const rval = this.rule.val as Rule[];

		if(i >= rval.length){
			this.reset();
			this.vals["__sym"] = this.rule.refs[selop.textContent as string];
			return null;
		}
		const r = rval[i];
		if(r.val instanceof Array && r.val.length == 0){
			this.reset();
			this.vals["__sym"] = new Sym(r, this, false, null);
			return null;
		}
		if(this.has(r))
			return null;
		return new Sym(r, this, null);
	}
}

class Obj{
	readonly sym: Sym;
	readonly div: HTMLDivElement;
	readonly input: HTMLInputElement | HTMLSelectElement | null;
	readonly parent: HTMLOptionElement | Primitive;
	obj: Obj[];

	constructor(sym: Sym, div: HTMLDivElement, parent: HTMLOptionElement | Primitive){
		this.sym = sym
		this.div = div;
		this.parent = parent;
		this.obj = [];
		sym.obj = this;
		addbutt(div, "x", () => {
			this.sym.pop();
		});
		this.input = this.init(sym.rule);
	}
	init(rule: Rule): HTMLInputElement | HTMLSelectElement | null{
		addlabel(this.div, rule.label);
		let input: HTMLInputElement | HTMLSelectElement;
		if(rule.val instanceof Array){
			const r: Rule[] = rule.val as Rule[];
			if(r.length === 0)
				return null;

			const sel = newelement("select") as HTMLSelectElement;
			addoption(sel, " -- ", true, true);
			r.forEach((v) => {
				addoption(sel, v.label);
			});
			let nel = 0;
			for(let k in rule.refs){
				if(rule.refs[k].ref() === this.sym.ref())
					continue;
				nel++;
				if(nel == 1)
					addoption(sel, " -- ", true);
				addoption(sel, rule.refs[k].ref());
			}
			sel.addEventListener("input", () => {
				this.setsel(this);
			});
			this.div.appendChild(sel);
			input = sel;
		}else{
			const num = newelement("input") as HTMLInputElement;
			num.type = "text";
			num.value = (rule.val as number).toString();
			num.addEventListener("change", () => {
				this.setval(this);
			});
			this.div.appendChild(num);
			input = num;
		}
		return input;
	}
	pop(){
		this.div.innerHTML = "";
		this.div.remove();
		if(this.parent instanceof HTMLOptionElement)
			(this.parent as HTMLOptionElement).disabled = false;
		else
			(this.parent as Primitive).fixindices();
	}
	setval(o: Obj){
		o.sym.val1 = Number((o.input as HTMLInputElement).value);
	}
	setsel(o: Obj){
		const sel = o.input as HTMLSelectElement;
		const i = sel.selectedIndex - 1;

		const sym = o.sym.setvals(i, sel.selectedOptions[0]);
		if(sym === null)
			return;

		const d = adddiv(o.div);
		FIXME:
		const obj = new Obj(sym, d, sel.selectedOptions[0]);
		o.obj.push(obj);

		sel.selectedOptions[0].disabled = true;
		sel.selectedIndex = 0;
	}
};

class Seldom{
	readonly id: string;
	readonly dom: HTMLSelectElement;

	constructor(id: string){
		this.id = id;
		const el = document.getElementById(id);
		this.dom = el as HTMLSelectElement;
		if(el === null)
			fatal("Seldom: no such element " + id);
	}
}
class Datdom{
	readonly id: string;
	readonly dom: HTMLDivElement;

	constructor(id: string){
		this.id = id;
		const el = document.getElementById(id);
		this.dom = el as HTMLDivElement;
		if(el === null)
			fatal("Datdom: no such element " + id);
	}
}
class Primitive{
	readonly name: string;
	readonly root: Datdom;
	readonly sel: Seldom;
	readonly data: Datdom;
	readonly rules: Rule[];
	readonly curfn: (() => void) | null;
	syms: Sym[];
	cur: number;

	constructor(tag: string, curfn: (() => void) | null = null){
		this.name = tag;
		this.root = new Datdom(tag);
		this.data = new Datdom(tag + "data");
		this.sel = new Seldom(tag + "sel");
		this.rules = rules[tag];
		this.cur = 0;
		this.curfn = curfn;
		this.rules.forEach((v) => {
			this.addoption(v.label);
		});
		this.sym = [];
	}
	private addoption(value: string): HTMLOptionElement{
		const o = newelement("option") as HTMLOptionElement;
		if(o === null)
			fatal("addoption: couldn't create an option element");
		this.sel.dom.add(o);
		o.value = value;
		o.textContent = value;
		return o;
	}
	setcur(i: number): void{
		if(this.cur !== i && this.curfn !== null)
			this.curfn();
		this.cur = i;
	}
	add(): void{
		const d = adddiv(this.data.dom);

		const sym = new Sym(this.rules[this.cur], this);
		const obj = sym.putobj();
			FIXME: should check that obj already exists etc
		obj.

		FIXME:

		const dom = this.data.dom;
		const i = dom.childElementCount + 1;

		const d = adddiv(dom);
		addlabel(d, "[" + i + "]");
		d.className = this.name + "obj";
		d.id = this.name + i;	FIXME
		const sym = new Sym(this.rules[this.cur], this, d);
		FIXME:
		const obj = new Obj(sym, d, this);
		this.obj.push(obj);
	}
	setone(i: number){
		this.nuke();
		this.setcur(i);
		const sym = new Sym(this.rules[this.cur], this);
		this.syms.push(sym);

		FIXME: add obj?
		FIXME: label


		FIXME:
		// FIXME: no longer setting ref to this.name + "1", check if problem
		const sym = new Sym(this.rules[this.cur], this, null);
		const obj = new Obj(sym, this.data.dom, this);
		this.obj.push(obj);
	}
	fixindices(){
		let i = 1;
		this.syms.forEach((s) => {
			s.parentid = i;
			s.obj.setlabel("[" + i + "] " + s.rule.label);
			FIXME: s.obj.label.textContent = ...;
			i++;
		});
	}
	nuke(){
		this.syms.forEach((s) => {
			s.pop();
		});
		this.syms = [];
	}
}
let prim: { [name: string]: Primitive; } = {
	"alpha": new Primitive("alpha", () => {
		prim["seq"].nuke();
	}),
	"index1": new Primitive("index1"),
	"index2": new Primitive("index2"),
	"seq": new Primitive("seq"),
	"tree": new Primitive("tree"),
	"model": new Primitive("model"),
	"root": new Primitive("root"),
	"rate": new Primitive("rate"),
	"proc": new Primitive("proc"),
	"phyl": new Primitive("phyl"),
};

function setcur(name: string, i: number): void{
	prim[name].setcur(i);
}
function setone(name: string, i: number): void{
	prim[name].setone(i);
}
function add(name: string): void{
	prim[name].add();
}
function submit(): void{

}

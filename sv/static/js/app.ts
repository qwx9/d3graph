function fatal(err: string){
	console.log(err);
	throw new Error(err);
}

class Rule{
	label: string;
	sym: string;
	val: Rule[] | number | null;

	constructor(label: string, val: number | Rule[] | null = null, sym?: string){
		this.label = label;
		this.sym = sym ? sym : label;
		this.val = val;
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
		new Rule("Fasta", []),
		new Rule("Mase", []),
		new Rule("Phylip", []),
		new Rule("Clustal", []),
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
		new Rule("HKY85", [
			new Rule("test", []),
			new Rule("test2", []),
			new Rule("testval", 42),
		]),
		new Rule("HKY85-1", 44),
	],
	"root": [
	],
	"rate": [
	],
	"proc": [
	],
	"phyl": [
	],
};

class Obj{
	readonly rule: Rule;
	readonly div: HTMLDivElement;
	readonly input: HTMLInputElement | HTMLSelectElement;
	readonly ref: string;
	val: Obj[] | number;

	constructor(rule: Rule, div: HTMLDivElement, idx: number, parent: Obj | null = null){
		this.rule = rule;
		this.div = div;
		this.ref = (parent !== null) ? parent.ref : div.id;
		this.ref += ":" + rule.label + idx;
		const {input:i, val:v} = this.init(idx);
		this.input = i;
		this.val = v;
	}
	init(idx: number){
		const lab: HTMLSpanElement = document.createElement("span");
		let input: HTMLInputElement | HTMLSelectElement;
		let val: Obj[] | number;
		lab.textContent = "[" + idx + "] " + this.rule.label;
		this.div.appendChild(lab);

		if(this.rule.val instanceof Array){
			const r: Rule[] = this.rule.val as Rule[];
			const sel = document.createElement("select") as HTMLSelectElement;
			r.forEach((v) => {
				const o = document.createElement("option") as HTMLOptionElement;
				if(o === null)
					fatal("obj: couldn't create an option element");
				o.value = v.label;
				o.textContent = v.label;
				sel.add(o);
			});
			/* fuck this world */
			sel.addEventListener("change", () => {
				this.setsel(this);
			});
			this.div.appendChild(sel);
			input = sel;
			val = [];
		}else{
			const num = document.createElement("input") as HTMLInputElement;
			num.type = "text";
			num.value = (this.rule.val as number).toString();
			num.addEventListener("change", () => {
				this.setval(this);
			});
			this.div.appendChild(num);
			input = num;
			val = this.rule.val as number;
		}
		return {input:input, val:val};
	}
	setval(o: Obj){
		o.val = Number((o.input as HTMLInputElement).value);
		alert("setval " + o.val + " in " + o.ref);
	}
	setsel(o: Obj){
		// FIXME: push new object, same structure, we need another root div
		// FIXME: select first, default, element -> nothing, we need nothing selected

		const d: HTMLDivElement = document.createElement("div");
		this.div.appendChild(d);

		// FIXME: wrong, must be number of same obj
		//const i = this.div.childElementCount;
		const el = (this.input as HTMLSelectElement).selectedIndex;
		const r = (this.rule.val as Rule[])[el];
		const obj = new Obj(r, d, 1, o);
		(this.val as Obj[]).push(obj);
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
	obj: Obj[];
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
		this.obj = [];
	}
	private addoption(value: string): HTMLOptionElement{
		const o: HTMLOptionElement = document.createElement("option");
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
		const d: HTMLDivElement = document.createElement("div");
		const dom = this.data.dom;
		dom.appendChild(d);

		const i = dom.childElementCount;
		d.className = this.name + "obj";
		d.id = d.className + i;

		const obj = new Obj(this.rules[this.cur], d, i);
		this.obj.push(obj);
	}
	nuke(): void{
		const dom: HTMLElement = this.data.dom;
		while(dom.hasChildNodes())
			dom.removeChild(dom.firstChild as ChildNode);
		this.obj = [];
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
function add(name: string): void{
	prim[name].add();
}
function submit(): void{

}

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
			new Rule("theta1", 0.1),
			new Rule("theta2", 0.1),
			// FIXME: equilibrium frequencies, everywhere
		]),
		new Rule("HKY85", [
			new Rule("kappa", 0.1),
			new Rule("theta", 0.1),
			new Rule("theta1", 0.1),
			new Rule("theta2", 0.1),
		]),
		new Rule("T92", [
			new Rule("kappa", 0.1),
			new Rule("theta", 0.1),
		]),
		new Rule("TN93", [
			new Rule("kappa1", 0.1),
			new Rule("kappa2", 0.1),
			new Rule("theta", 0.1),
			new Rule("theta1", 0.1),
			new Rule("theta2", 0.1),
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

class Obj{
	readonly rule: Rule;
	readonly div: HTMLDivElement;
	readonly input: HTMLInputElement | HTMLSelectElement | null;
	readonly ref: string;
	readonly idx: number;
	val: Obj[] | number;

	constructor(rule: Rule, div: HTMLDivElement, idx: number, parent: Obj | null = null){
		this.idx = idx;
		this.rule = rule;
		this.div = div;
		this.ref = (parent !== null) ? parent.ref : div.id;
		this.ref += ":" + rule.label + "_" + idx;
		const {input:i, val:v} = this.init();
		this.input = i;
		this.val = v;
	}
	init(){
		const lab: HTMLSpanElement = document.createElement("span");
		let input: HTMLInputElement | HTMLSelectElement;
		let val: Obj[] | number;
		lab.textContent = "[" + this.idx + "] " + this.rule.label;
		this.div.appendChild(lab);

		if(this.rule.val instanceof Array){
			const r: Rule[] = this.rule.val as Rule[];
			if(r.length === 0)
				return {input:null, val:-1};

			const sel = document.createElement("select") as HTMLSelectElement;
			const o = document.createElement("option") as HTMLOptionElement;
			o.defaultSelected = true;
			o.selected = true;
			o.disabled = true;
			o.text = " -- ";
			sel.add(o);
			r.forEach((v) => {
				const o = document.createElement("option") as HTMLOptionElement;
				// FIXME: everywhere? wrap?
				if(o === null)
					fatal("obj: couldn't create an option element");
				o.value = v.label;
				o.textContent = v.label;
				sel.add(o);
			});
			/* fuck this world */
			sel.addEventListener("input", () => {
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
		const sel = this.input as HTMLSelectElement;
		const i = sel.selectedIndex - 1;
		const r = (this.rule.val as Rule[])[i];

		// FIXME: record index or just get from dom later?
		// FIXME: this allows params with no value not being saved
		//	but then such params don't make sense
		if(r.val instanceof Array && r.val.length == 0)
			return;

		const d: HTMLDivElement = document.createElement("div");
		this.div.appendChild(d);

		const obj = new Obj(r, d, this.idx, o);
		(this.val as Obj[]).push(obj);

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
	setone(i: number){
		this.setcur(i);
		// FIXME: better, mutable root obj? not an obj?
		if(this.obj.length !== 0){
			this.obj = [];
			this.data.dom.innerHTML = "";
		}
		const obj = new Obj(this.rules[this.cur], this.data.dom, 1);
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
function setone(name: string, i: number): void{
	prim[name].setone(i);
}
function add(name: string): void{
	prim[name].add();
}
function submit(): void{

}

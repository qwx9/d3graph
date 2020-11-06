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
		new Rule("HKY85", []),
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
	cur: number;

	constructor(tag: string){
		this.name = tag;
		this.root = new Datdom(tag);
		this.data = new Datdom(tag + "data");
		this.sel = new Seldom(tag + "sel");
		this.rules = rules[tag];
		this.cur = 0;
		this.rules.forEach((v) => {
			this.addoption(v.label);
		});
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
	add(): {i: number, dom: HTMLDivElement}{
		const d: HTMLDivElement = document.createElement("div");
		d.className = this.name + "obj";

		const dom = this.data.dom;
		dom.appendChild(d);
		return {i: dom.childElementCount, dom: d};
	}
	nuke(): void{
		const dom: HTMLElement = this.data.dom;
		while(dom.hasChildNodes())
			dom.removeChild(dom.firstChild as ChildNode);
	}
}
let prim: { [name: string]: Primitive; } = {
	"alpha": new Primitive("alpha"),
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

function setalpha(v: number): void{
	const p: Primitive = prim["alpha"];
	if(p.cur !== v){
		p.cur = v;
		prim["seq"].nuke();
	}
}

function setindex1(v: number): void{
	prim["index1"].cur = v;
}

function setindex2(v: number): void{
	prim["index2"].cur = v;
}

function setseq(v: number): void{
	prim["seq"].cur = v;
}
function addseq(): void{
	const p = prim["seq"];
	const {i, dom} = p.add();
	dom.textContent = "[" + i + "] " + p.sel.dom.options[p.cur].value;
}

function settree(v: number): void{ prim["tree"].cur = v;
	prim["tree"].cur = v;
}
function addtree(): void{
	const p = prim["tree"];
	const {i, dom} = p.add();
	dom.textContent = "[" + i + "] " + p.sel.dom.options[p.cur].value;
}

function setmodel(v: number): void{
	prim["model"].cur = v;

}
function addmodel(): void{
	const p = prim["model"];
	const {i, dom} = p.add();
	dom.textContent = "[" + i + "] " + p.sel.dom.options[p.cur].value;
}

function setroot(v: number): void{
	prim["root"].cur = v;

}
function addroot(): void{

}

function setrate(v: number): void{
	prim["rate"].cur = v;

}
function addrate(): void{

}

function setproc(v: number): void{
	prim["proc"].cur = v;
}
function addproc(): void{

}

function setphyl(v: number): void{
	prim["phyl"].cur = v;
}
function addphyl(): void{

}

function submit(): void{

}

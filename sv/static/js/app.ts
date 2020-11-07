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
	readonly curfn: (() => void) | null;
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
	appendchild(): {i: number, dom: HTMLDivElement}{
		const d: HTMLDivElement = document.createElement("div");
		d.className = this.name + "obj";

		const dom = this.data.dom;
		dom.appendChild(d);
		return {i: dom.childElementCount, dom: d};
	}
	add(): void{
		const {i, dom} = this.appendchild();
		dom.textContent = "[" + i + "] " + this.sel.dom.options[this.cur].value;
	}
	nuke(): void{
		const dom: HTMLElement = this.data.dom;
		while(dom.hasChildNodes())
			dom.removeChild(dom.firstChild as ChildNode);
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

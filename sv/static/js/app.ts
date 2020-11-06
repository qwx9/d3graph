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
};

class Dom{
	readonly id: string;
	readonly dom: HTMLElement;

	constructor(id: string){
		this.id = id;
		const el = document.getElementById(id);
		this.dom = el as HTMLElement;
		if(el === null){
			fatal("Dom: no such element " + id);
			return;
		}
	}
}
class Primitive{
	readonly name: string;
	readonly root: Dom;
	readonly data: Dom;
	readonly rules: Rule[];
	cur: number | null;

	constructor(tag: string, sel: boolean = false){
		this.name = tag;
		this.root = new Dom(tag);
		this.data = new Dom(tag + "data");
		this.rules = rules[tag];
		this.cur = null;
		if(sel)
			this.mkselect();
	}
	private addoption(value: string): HTMLOptionElement{
		const d: HTMLElement = document.createElement("option");
		if(d === null){
			fatal("addoption: couldn't create an option element");
		}
		this.data.dom.appendChild(d);
		const o: HTMLOptionElement = d as HTMLOptionElement;
		o.value = value;
		o.textContent = value;
		return o;
	}
	private mkselect(): void{
		this.rules.forEach((v) => {
			this.addoption(v.label);
		});
		this.cur = 0;
	}
	add(): {i: number, dom: HTMLElement}{
		const d: HTMLElement = document.createElement("div");
		if(d === null)
			fatal("add: couldn't create a div element");
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
	"alpha": new Primitive("alpha", true),
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

function addseq(): void{
	const v = prim["seq"].add();
	v.dom.textContent = "[" + v.i + "] " + "SOMESEQ";
}

function addtree(){

}

function addmodel(){

}

function addroot(){

}

function addrate(){

}

function addproc(){

}

function addphyl(){

}

function fatal(err: string){
	console.log(err);
	throw new Error(err);
}

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
	cur: number | null;

	constructor(tag: string){
		this.name = tag;
		this.root = new Dom(tag);
		this.data = new Dom(tag + "data");
		const sel = document.getElementById(tag + "sel");
		this.cur = sel ? (sel as HTMLSelectElement).selectedIndex : null;
	}
	nuke(): void{
		const dom: HTMLElement = this.data.dom;
		while(dom.hasChildNodes())
			dom.removeChild(dom.firstChild as ChildNode);
	}
}

let prim: { [name: string]: Primitive; } = {
	"alpha": new Primitive("alpha"),
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
	const p: Primitive = prim["seq"];
	const d: HTMLElement = document.createElement("div");
	d.className = p.name + "obj";

	const id: number = p.data.dom.childElementCount + 1;
	const v: string = "SOMESEQ";
	d.textContent = "[" + id + "] " + v;

	p.data.dom.appendChild(d);
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

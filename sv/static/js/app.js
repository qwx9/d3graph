/* bypass cache: ^F5
 * alert(string);
 */

/* FIXME: steps
 * - implement alpha, seq, tree, rate, root forms
 * - implement python script compiling html and render this data-driven
 */

/* FIXME: convert to typescript */

/* FIXME: seq validity: check that the alphabet is correct?
 * can be heavy client side, but then would avoid server load
 * but then responsiveness would take a hit
 * problem: too many formats and some we can't handle
 * should secure and send to server and either return error or detect that all is ok
 * if error, should not keep data if user leaves page (or other conditions?)
 *	must prevent any server-side meddling
 */

/* FIXME: submit validation
 * form with onsubmit="return(validate());" with validate our function
 * if valid, compile and set content of form before submitting
 * content = form + multiple files
 */

/* FIXME: select file to upload, do not display more than file name
 * how to upload separate files: <input type="file" multiple> within form
 * => seqs, trees
 */

/* FIXME: data-oriented approach: don't hardcode anything in html/js
 * rather, compile html beforehand with a script just like the typescript
 * then get stuff from it in the js
 * hybrid: script parsing json into html and loaded into js, but now there's a vector for error
 * synthesize the html for the different divs using a python/R lib or w/e
 *	or if it's just a simple file with the hierarchy/key-value, can use awk etc
 *	but others won't be able to change it because ain't no one know awk
 *	just a json then + python, we already use flask
 */

/* FIXME: input: see biopp manual for all possibilities
 * encode in some key-value store, insert in html, write general code here
 * most if not all is hierarchical
 * alphabet=Codon -> all seqs are prot -> specific models -> specific params
 * given model -> specific options and possibilities
 */

/* FIXME: tree formats
 * no js parser for Nexus files
 * there are many for newick, and 1-2 for nhx (nhx.js, tnt.newick: both)
 */

var seqa = [];
function addseq(){
	const id = seqa.length + 1;
	const seq = {id:id, v:"SOMESEQ"};
	seqa.push(seq);

	const d = document.createElement("div");
	d.className = "seq";
	d.textContent = "[" + seq.id + "] " + seq.v;
	document.getElementById("seqdat").appendChild(d);
}

// FIXME: all possibilities
var curalpha = document.getElementById("seqalpha").selectedIndex;
function setalpha(v){
	if(curalpha !== v){
		const seqs = document.getElementById("seqdat");
		while(seqs.hasChildNodes())
			seqs.removeChild(seqs.firstChild);
		seqa = [];
		curalpha = v;
	}
}

function addtree(){
	// FIXME: parse nodes to be able to attribute models
}

function addmodel(){
	// FIXME: add simple homogenous model: json with name and variables dicts
	// FIXME: select model
	// FIXME: add params values that won't be defaults (hash tables)
}

function addroot(){
	// FIXME: reference a tree
}

function addrate(){

}

function addproc(){
	// FIXME: reference model + tree etc
}

function addphyl(){
	// FIXME: reference proc + data
}

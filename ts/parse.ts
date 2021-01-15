/* internal model state common functions */

/* push a compilation error to *errors* array, with an error string
 * and value (or option if we never even got to compile the tree). */
function pusherror(e: string, v: Value | BppOpt){
	errors.push({err:e, val:v});
}
/* compile symbol tree for each expression type. return a single
 * concatenation of all expression lines. remove a special
 * placeholder symbol `$'. */
function compile(){
	/* reset *errors* and *files* arrays */
	errors = [];
	files = {};
	/* compile each expression */
	let s: string = "";
	for(let k in options)
		s += options[k].compile().replace(/\$/g, "");
	s += forcedparms;
	return s;
}

/* common internal functions */

/* stop execution for fatal error: display error string and exit;
 * by nature of javascript, for debugging only and necessitates
 * an open console. errors are considered irrecoverable and will
 * almost always result in an invalid state. */
function fatal(err: string){
	console.log(err);
	throw new Error(err);
}

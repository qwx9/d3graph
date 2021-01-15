/* main source file. this is the only file containing declarations and
 * instructions, all other files only declare new classes and functions.
 * all global variables are declared and instanciated recursively here. */

/* reference table used for sym pointers. must be defined BEFORE ruleset
 * since Rule instanciation creates ref elements used later! */
let reftab: { [name: string]: Ref } = {};

/* file table associative array, accessed by symbol name. to avoid
 * conflicts and invalid state, generated only at compilation. */
let files: { [index: string]: HTMLInputElement } = {};
/* errors generated during compilation. regenerated at compilation and
 * contains error string and offending value node (currently unused). */
let errors: {err:string, val:Value|BppOpt}[] = [];

/* ruleset graph declaration and initialization. this is the template
 * for any new model and specifies what model elements can be created
 * and how. rules use a somewhat confusing syntax for recursivity, and
 * specify a root symbol, then its value, which is a "data" rule, which
 * in turn has its own semantics to specify a primitive type, or lists,
 * functions, references, etc. this is necessary to preserve a maximally
 * general structure while allowing for all the eccentricities of a bpp
 * model specification. unfortunately, some of the possibilities add a
 * lot of complexity. rules first specify an on-screen label, then the
 * internal label used in bpp files, then a data rule, then other=
 * optional parameters.
 * 
 * special case: use a special character `$' stripped after compilation
 * to avoid erroneous references when symbols would reuse the same name
 * (when the parameter name is the same as what it is supposed to
 * reference as in: rate=[rate refs]).
 */
const rules: { [name: string]: Rule } = {
	"alphabet": new Rule("Alphabet", "alphabet", new ROne([
		new Rule("DNA", "DNA"),
		new Rule("RNA", "RNA"),
		new Rule("Protein", "Protein"),
		new Rule("Binary", "Binary"),
		new Rule("Lexicon", "Lexicon", new RString()),
		new Rule("Word", "Word", new RParam([
			new Rule("Letter", "letter", new ROne([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
				new Rule("Protein", "Protein"),
			])),
			new Rule("Length", "length", new RInteger(1)),
		])),
		new Rule("Codon", "Codon", new RParam([
			new Rule("Letter", "letter", new ROne([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
			])),
		])),
	]), true),
	"gencode": new Rule("Genetic code", "genetic_code", new ROne([
		new Rule("Standard (1)", "Standard"),
		new Rule("VertebrateMitochondrial (2)", "VertebrateMitochondrial"),
	])),
	"seq": new Rule("Sequence data", "input.data", new RAny([
		new Rule("Aligned sequence", "alignment", new RParam([
			new Rule("File", "file", new RFile(), true),
			new Rule("Format", "format", new ROne([
				new Rule("Fasta", "Fasta", new RParam([
					new Rule("extended", "extended", new RBool()),
					new Rule("strictNames", "strictNames", new RBool()),
				])),
				new Rule("Mase", "Mase", new RParam([
					new Rule("siteSelection", "siteSelection", new RBool(true)),
				])),
				new Rule("Phylip", "Phylip", new RParam([
					new Rule("order", "order", new ROne([
						new Rule("interleaved", "interleaved"),
						new Rule("sequential", "sequential"),
					])),
					new Rule("type", "type", new ROne([
						new Rule("classic", "classic"),
						new Rule("extended", "extended"),
					])),
					new Rule("split", "split", new ROne([
						new Rule("spaces", "spaces"),
						new Rule("tab", "tab"),
					])),
				])),
				new Rule("Clustal", "Clustal", new RParam([
					new Rule("extraSpaces", "extraSpaces", new RBool()),
				])),
				new Rule("Dcse", "Dcse", new RParam([
				])),
				new Rule("Nexus", "Nexus", new RParam([
				])),
				new Rule("Genbank", "Genbank", new RParam([
				])),
			]), true),
			new Rule("Sites to use", "sites_to_use", new ROne([
				new Rule("All", "all"),
				new Rule("No Gaps", "nogap"),
				new Rule("Complete", "complete"),
			])),
			new Rule("Remove stop codons", "remove_stop_codons", new RBool()),
			new Rule("Max allowed gap %", "max_gap_allowed", new RPercent()),
			new Rule("Max allowed unresolved %", "max_unresolved_allowed", new RPercent()),
		])),
	])),
	"tree": new Rule("Tree data", "input.tree", new RAny([
		new Rule("Random", "random", new RParam([
			new Rule("Leaf data index", "data", new RInteger()),
		])),
		new Rule("User tree", "user", new RParam([
			new Rule("File", "file", new RFile(), true),
			new Rule("Format", "format", new ROne([
				new Rule("Newick", "Newick"),
				new Rule("Nexus", "Nexus"),
				new Rule("NHX", "NHX"),
			]), true),
			new Rule("Additional options", "", new RVerbatim()),
		])),
	])),
	"model": new Rule("Tree model", "model", new RAny([
		new Rule("JC69", "JC69", new RParam([])),
		new Rule("K80", "K80", new RParam([
			new Rule("kappa", "kappa", new RRef("kappa", new Rule("", "", new RFloat()))),
		])),
		new Rule("F84", "F84", new RParam([
			new Rule("kappa", "kappa", new RRef("kappa", new Rule("", "", new RFloat()))),
			new Rule("theta", "theta", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta1", "theta_1", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta2", "theta_2", new RRef("theta", new Rule("", "", new RFloat()))),
		])),
		new Rule("HKY85", "HKY85", new RParam([
			new Rule("kappa", "kappa", new RRef("kappa", new Rule("", "", new RFloat()))),
			new Rule("theta", "theta", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta1", "theta_1", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta2", "theta_2", new RRef("theta", new Rule("", "", new RFloat()))),
		])),
		new Rule("T92", "T92", new RParam([
			new Rule("kappa", "kappa", new RRef("kappa", new Rule("", "", new RFloat()))),
			new Rule("theta", "theta", new RRef("theta", new Rule("", "", new RFloat()))),
		])),
		new Rule("TN93", "TN93", new RParam([
			new Rule("kappa1", "kappa_1", new RRef("kappa", new Rule("", "", new RFloat()))),
			new Rule("kappa2", "kappa_2", new RRef("kappa", new Rule("", "", new RFloat()))),
			new Rule("theta", "theta", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta1", "theta_1", new RRef("theta", new Rule("", "", new RFloat()))),
			new Rule("theta2", "theta_2", new RRef("theta", new Rule("", "", new RFloat()))),
		])),
	])),
	"root": new Rule("Root frequencies", "root", new RAny([
		new Rule("Fixed", "Fixed", new RParam([])),
		new Rule("GC", "GC", new RParam([
			new Rule("kappa", "kappa", new RPropor()),
		])),
	])),
	"rate": new Rule("Substitution rate", "rate_distribution", new RAny([
		new Rule("Constant", "Constant"),
	])),
	"proc": new Rule("Evolutionary process", "process", new RAny([
		new Rule("Homogeneous", "Homogeneous", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RAnyRef("model", []), true),
			new Rule("Rate", "rate", new RAnyRef("rate_distribution", []), true),
			new Rule("Root", "root_freq", new RAnyRef("root", [])),
		])),
		new Rule("NonHomogeneous", "NonHomogeneous", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RVerbatim(), true),
			new Rule("Rate", "rate", new RAnyRef("rate_distribution", []), true),
			new Rule("Root", "root_freq", new RAnyRef("root", [])),
		])),
		new Rule("OnePerBranch", "OnePerBranch", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RVerbatim(), true),
			new Rule("Rate", "rate", new RAnyRef("rate_distribution", []), true),
			new Rule("Root", "root_freq", new RAnyRef("root", [])),
			new Rule("Shared parameters", "shared_parameters", new RVerbatim()),
		])),
		/*
		new Rule("Mixture", "Mixture", new RAny([
			new Rule("Process", "$process", new RAnyRef("process", new ROnce([
				new Rule("Process probabilities", "probas", new RDynVector(), true),
			]))),
		]), true),
		new Rule("Auto-correlated", "AutoCorr", new RAny([
			new Rule("Process", "$process", new RAnyRef("process", new ROnce([
				new Rule("Autocorrelation probabilities", "probas", new RDynVector(), true),
			]))),
		]), true),
		new Rule("HMM", "HMM", new RAny([
			new Rule("Process", "$process", new RAnyRef("process", new ROnce([
				new Rule("Transition probabilities", "probas", new RDynVector(2), true),
			]))),
		]), true),
		new Rule("Partition", "Partition", new RAny([
			new Rule("Process", "$process", new RAnyRef("process", new RAny([
				new Rule("Parent ranges", "sites", new RVerbatim(), true, true),
			]))),
		]), true),
		*/
	])),
	"phyl": new Rule("Phylogeny", "phylo", new RAny([
		new Rule("Single", "Single", new RParam([
			new Rule("Data", "data", new RAnyRef("input.data", []), true),
			new Rule("Process", "$process", new RAnyRef("process", []), true),
		])),
		new Rule("Double", "Double", new RParam([
			new Rule("Data", "data", new RAnyRef("input.data", []), true),
			new Rule("Process", "$process", new RAnyRef("process", []), true),
		])),
	]), true),
	"result": new Rule("Result", "result", new ROne([
		new Rule("", "", new RString(""), true),
	])),
};
/* config parameters always appended to compilation output. */
const forcedparms = [
	"optimization.profiler=input.profile",
	"output.tree.file=output.dnd",
	"output.tree.format=Newick",
	"output.infos=output.infos",
	"output.estimates=output.params.txt",
];

/* create root elements to generate initial empty state from which new
 * expressions may be spawned. names correspond to those of ruleset
 * elements. */
const options: { [name: string]: BppOpt } = {
	"alphabet": new BppOpt("alphabet"),
	"gencode": new BppOpt("gencode"),
	"seq": new BppOpt("seq"),
	"tree": new BppOpt("tree"),
	"model": new BppOpt("model"),
	"root": new BppOpt("root"),
	"rate": new BppOpt("rate"),
	"proc": new BppOpt("proc"),
	"phyl": new BppOpt("phyl"),
	"result": new BppOpt("result"),
};

/* create compilation and submissal buttons, and register event handlers */
registersubmit();

let reftab: { [name: string]: Sym[] } = {};
const rules: { [name: string]: Rule } = {
	"alphabet": new Rule("Alphabet", "alphabet", new RSelect([
		new Rule("DNA", "DNA"),
		new Rule("RNA", "RNA"),
		new Rule("Protein", "Protein"),
		new Rule("Binary", "Binary"),
		new Rule("Lexicon", "Lexicon", new RString()),
		new Rule("Word", "Word", new RObj([
			new Rule("Letter", "letter", new RSelect([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
				new Rule("Protein", "Protein"),
			])),
			new Rule("Length", "length", new RInteger(1)),
		])),
		new Rule("Codon", "Codon", new RObj([
			new Rule("Letter", "letter", new RSelect([
				new Rule("DNA", "DNA"),
				new Rule("RNA", "RNA"),
			])),
		])),
	])),
	"gencode": new Rule("Genetic code", "genetic_code", new RSelect([
		new Rule("Standard (1)", "Standard"),
		new Rule("VertebrateMitochondrial (2)", "VertebrateMitochondrial"),
	])),
	"seq": new Rule("Sequence data", "input.data", new RObj([
		new Rule("Aligned sequence", "alignment", new RObj([
			new Rule("Path", "path", new RFile()),
			new Rule("Format", "format", new RSelect([
				new Rule("Fasta", "Fasta", new RObj([
					new Rule("extended", "extended", new RBool()),
					new Rule("strictNames", "strictNames", new RBool()),
				])),
				new Rule("Mase", "Mase", new RObj([
					new Rule("siteSelection", "siteSelection", new RBool(true)),
				])),
				new Rule("Phylip", "Phylip", new RObj([
					new Rule("order", "order", new RSelect([
						new Rule("interleaved", "interleaved"),
						new Rule("sequential", "sequential"),
					])),
					new Rule("type", "type", new RSelect([
						new Rule("classic", "classic"),
						new Rule("extended", "extended"),
					])),
					new Rule("split", "split", new RSelect([
						new Rule("spaces", "spaces"),
						new Rule("tab", "tab"),
					])),
				])),
				new Rule("Clustal", "Clustal", new RObj([
					new Rule("extraSpaces", "extraSpaces", new RBool()),
				])),
				new Rule("Dcse", "Dcse", new RObj([
				])),
				new Rule("Nexus", "Nexus", new RObj([
				])),
				new Rule("Genbank", "Genbank", new RObj([
				])),
			])),
		])),
	])),
	"tree": new Rule("Tree data", "input.tree", new RObj([
		new Rule("Random", "random", new RObj([
			new Rule("Leaf data index", "data", new RInteger()),
		])),
		new Rule("User tree", "user", new RObj([
			new Rule("Path", "path", new RFile()),
			new Rule("Format", "format", new RSelect([
				new Rule("Newick", "Newick"),
				new Rule("Nexus", "Nexus"),
				new Rule("NHX", "NHX"),
			])),
		])),
	])),
	"model": new Rule("model", "model", new RObj([
		new Rule("JC69", "JC69", new RObj([])),
		new Rule("K80", "K80", new RObj([
			new Rule("kappa", "kappa", new RRef(false,
				new Rule("kappa", "kappa", new RFloat())
			)),
		])),
		new Rule("F84", "F84", new RObj([
			new Rule("kappa", "kappa", new RRef(false,
				new Rule("kappa", "kappa", new RFloat())
			)),
			new Rule("theta", "theta", new RRef(false,
				new Rule("theta", "theta", new RFloat())
			)),
			new Rule("theta1", "theta", new RRef(false,
				new Rule("theta1", "theta_1", new RFloat())
			)),
			new Rule("theta2", "theta", new RRef(false,
				new Rule("theta2", "theta_2", new RFloat())
			)),
		])),
		new Rule("HKY85", "HKY85", new RObj([
			new Rule("kappa", "kappa", new RRef(false,
				new Rule("kappa", "kappa", new RFloat())
			)),
			new Rule("theta", "theta", new RRef(false,
				new Rule("theta", "theta", new RFloat())
			)),
			new Rule("theta1", "theta", new RRef(false,
				new Rule("theta1", "theta_1", new RFloat())
			)),
			new Rule("theta2", "theta", new RRef(false,
				new Rule("theta2", "theta_2", new RFloat())
			)),
		])),
		new Rule("T92", "T92", new RObj([
			new Rule("kappa", "kappa", new RRef(false,
				new Rule("kappa", "kappa", new RFloat())
			)),
			new Rule("theta", "theta", new RRef(false,
				new Rule("theta", "theta", new RFloat())
			)),
		])),
		new Rule("TN93", "TN93", new RObj([
			new Rule("kappa1", "kappa", new RRef(false,
				new Rule("kappa1", "kappa_1", new RFloat())
			)),
			new Rule("kappa2", "kappa", new RRef(false,
				new Rule("kappa2", "kappa_2", new RFloat())
			)),
			new Rule("theta", "theta", new RRef(false,
				new Rule("theta", "theta", new RFloat())
			)),
			new Rule("theta1", "theta", new RRef(false,
				new Rule("theta1", "theta_1", new RFloat())
			)),
			new Rule("theta2", "theta", new RRef(false,
				new Rule("theta1", "theta_1", new RFloat())
			)),
		])),
	])),
	"root": new Rule("Root frequencies", "root", new RObj([
	])),
	"rate": new Rule("Substitution rate", "rate", new RObj([
	])),
	"proc": new Rule("Evolutionary process", "proc", new RObj([
	])),
	"phyl": new Rule("Phylogeny", "phyl", new RObj([
	])),
};
let refeltab: { [name: string]: VRefElem[] } = {};
const options: { [name: string]: BppOpt } = {
	"alphabet": new BppOpt("alphabet", () => {
		// FIXME: don't touch seqs, set subset of available models
		options["seq"].nuke();
	}),
	"gencode": new BppOpt("gencode"),
	"seq": new BppOpt("seq"),
	"tree": new BppOpt("tree"),
	"model": new BppOpt("model"),
	"root": new BppOpt("root"),
	"rate": new BppOpt("rate"),
	"proc": new BppOpt("proc"),
	"phyl": new BppOpt("phyl"),
};
let files: { [index: string]: HTMLInputElement } = {};

registersubmit();

let reftab: { [name: string]: Ref } = {};
let files: { [index: string]: HTMLInputElement } = {};
let errors: {err:string, val:Value|BppOpt}[] = [];
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
	"rate": new Rule("Substitution rate", "rate", new RAny([
		new Rule("Constant", "Constant"),
	])),
	"proc": new Rule("Evolutionary process", "process", new RAny([
		new Rule("Homogenous", "Homogenous", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RAnyRef("model", []), true),
			new Rule("Rate", "$rate", new RAnyRef("rate", []), true),
			new Rule("Root", "root_freq", new RAnyRef("root", [])),
		])),
		new Rule("NonHomogenous", "NonHomogenous", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RVerbatim(), true),
			new Rule("Rate", "$rate", new RAnyRef("rate", []), true),
			new Rule("Root", "root_freq", new RAnyRef("root", [])),
		])),
		new Rule("OnePerBranch", "OnePerBranch", new RParam([
			new Rule("Tree", "tree", new RAnyRef("input.tree", []), true),
			new Rule("Model", "$model", new RVerbatim(), true),
			new Rule("Rate", "$rate", new RAnyRef("rate", []), true),
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

registersubmit();
